// Reconcile Stripe subscriptions -> Supabase (users.tier + public.subscriptions).
// Dry run by default; pass --apply to write.
//
//   node --env-file=.env.local scripts/backfill-subscriptions.mjs
//   node --env-file=.env.local scripts/backfill-subscriptions.mjs --apply
//
// Requires STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// STRIPE_PRICE_PRO, STRIPE_PRICE_PREMIUM in the env file.

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');

const {
  STRIPE_SECRET_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  STRIPE_PRICE_PRO,
  STRIPE_PRICE_PREMIUM,
} = process.env;

if (!STRIPE_SECRET_KEY || !NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env: STRIPE_SECRET_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const admin = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const planForPrice = (id) =>
  id === STRIPE_PRICE_PRO ? 'pro' : id === STRIPE_PRICE_PREMIUM ? 'premium' : null;
const toIso = (u) => (typeof u === 'number' ? new Date(u * 1000).toISOString() : null);

console.log(`Mode: ${APPLY ? 'APPLY (will write)' : 'DRY RUN (read only)'}\n`);

const plan_targets = [];
let scanned = 0;

for await (const sub of stripe.subscriptions.list({
  status: 'all',
  limit: 100,
  expand: ['data.customer'],
})) {
  scanned++;
  if (sub.status !== 'active' && sub.status !== 'trialing') continue;

  const item = sub.items?.data?.[0];
  const priceId = item?.price?.id ?? null;
  const plan = planForPrice(priceId);
  if (!plan) continue;

  const metaUserId = sub.metadata?.supabase_user_id || null;
  const email =
    typeof sub.customer === 'object' && sub.customer && !sub.customer.deleted
      ? sub.customer.email
      : null;

  let userRow = null;
  if (metaUserId) {
    const { data } = await admin.from('users').select('id, email, tier').eq('id', metaUserId).maybeSingle();
    userRow = data;
  }
  if (!userRow && email) {
    const { data } = await admin.from('users').select('id, email, tier').eq('email', email).maybeSingle();
    userRow = data;
  }
  if (!userRow) {
    console.log(`? sub ${sub.id} (${plan}) -> no matching user (email=${email ?? 'n/a'}, meta=${metaUserId ?? 'n/a'})`);
    continue;
  }

  plan_targets.push({ userRow, sub, item, priceId, plan, email });
}

console.log(`Scanned ${scanned} subscriptions. ${plan_targets.length} active plan subscription(s) matched:\n`);
for (const t of plan_targets) {
  const tierNote = t.userRow.tier === t.plan ? 'tier ok' : `tier ${t.userRow.tier ?? 'free'} -> ${t.plan}`;
  console.log(`  ${t.email ?? t.userRow.id}: ${t.plan} (${tierNote}) [sub ${t.sub.id}, status ${t.sub.status}]`);
}

if (!plan_targets.length) {
  console.log('\nNothing to do.');
  process.exit(0);
}

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to write tier + subscriptions rows.');
  process.exit(0);
}

console.log('\nApplying...');
for (const t of plan_targets) {
  const { userRow, sub, item, priceId, plan } = t;

  // 1) entitlement
  const tierRes = await admin.from('users').update({ tier: plan }).eq('id', userRow.id);

  // 2) subscriptions row
  const row = {
    id: sub.id,
    user_id: userRow.id,
    status: sub.status,
    metadata: sub.metadata ?? {},
    price_id: priceId,
    quantity: item?.quantity ?? null,
    cancel_at_period_end: sub.cancel_at_period_end ?? false,
    created: toIso(sub.created),
    current_period_start: toIso(item?.current_period_start),
    current_period_end: toIso(item?.current_period_end),
    ended_at: toIso(sub.ended_at),
    cancel_at: toIso(sub.cancel_at),
    canceled_at: toIso(sub.canceled_at),
    trial_start: toIso(sub.trial_start),
    trial_end: toIso(sub.trial_end),
    interval: item?.price?.recurring?.interval ?? null,
  };
  let subRes = await admin.from('subscriptions').upsert(row);
  if (subRes.error && /foreign key|price_id|violates/i.test(subRes.error.message)) {
    subRes = await admin.from('subscriptions').upsert({ ...row, price_id: null });
  }

  const label = t.email ?? userRow.id;
  console.log(
    `  ${label}: tier ${tierRes.error ? 'ERR ' + tierRes.error.message : 'ok'}; ` +
      `subscription ${subRes.error ? 'ERR ' + subRes.error.message : 'ok'}`
  );
}
console.log('Done.');
