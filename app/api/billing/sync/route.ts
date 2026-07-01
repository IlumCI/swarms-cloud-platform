import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/billing/stripe';
import { getAuthedUser } from '@/lib/billing/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { applySubscription } from '@/lib/billing/service';

export const runtime = 'nodejs';

/**
 * Reconcile the signed-in user's subscription directly from Stripe and update
 * `users.tier` + `public.subscriptions`. This is the source of truth that does
 * not depend on the webhook reaching this deployment, so it works in local dev
 * and as a safety net if a webhook is missed. The user is matched to their
 * Stripe customer by email.
 */
export async function POST() {
  const user = await getAuthedUser();
  if (!user) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const stripe = getStripe();
  const admin = createAdminClient();
  if (!stripe || !admin) {
    return NextResponse.json(
      { error: 'Billing is not configured on this deployment.' },
      { status: 503 }
    );
  }

  if (!user.email) {
    return NextResponse.json(
      { error: 'Your account has no email to match a Stripe customer.' },
      { status: 400 }
    );
  }

  try {
    const customers = await stripe.customers.list({ email: user.email, limit: 5 });

    let chosen: Stripe.Subscription | null = null;
    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 20,
      });
      const activeSub = subs.data.find(
        (s) => s.status === 'active' || s.status === 'trialing'
      );
      if (activeSub) {
        chosen = activeSub;
        break;
      }
      if (!chosen && subs.data[0]) chosen = subs.data[0];
    }

    if (chosen) {
      await applySubscription(admin, chosen, user.id);
    } else {
      await admin.from('users').update({ tier: 'free' }).eq('id', user.id);
    }

    const { data } = await admin
      .from('users')
      .select('tier')
      .eq('id', user.id)
      .maybeSingle();

    return NextResponse.json({ synced: true, tier: data?.tier ?? null });
  } catch (error) {
    console.error('[api/billing/sync]', error);
    return NextResponse.json({ error: 'Sync failed. Please try again.' }, { status: 500 });
  }
}
