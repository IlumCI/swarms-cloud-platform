import { NextRequest, NextResponse } from 'next/server';
import { SwarmsAPIClient } from '@/lib/api/swarms-client';
import { resolveApiKey } from '@/lib/api/server-api-key';
import { jsonErrorFromUnknown } from '@/lib/api/errors';

const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_TTL_SECONDS = 30 * 60;

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  const apiKey = await resolveApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: 'No Swarms API key found. Sign in or create one in your Swarms account.' },
      { status: 401 }
    );
  }

  try {
    const force = request.nextUrl.searchParams.get('refresh') === '1';
    const cacheKey = apiKey;
    const now = Date.now();
    const cached = cache.get(cacheKey);

    if (!force && cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data, {
        headers: {
          'X-Cache': 'HIT',
          'X-Cache-Expires-In': String(
            Math.max(0, Math.floor((cached.expiresAt - now) / 1000))
          ),
          'Cache-Control': `private, max-age=${CACHE_TTL_SECONDS}`,
        },
      });
    }

    const client = new SwarmsAPIClient(
      apiKey,
      process.env.SWARMS_API_BASE_URL
    );

    const configs = await client.listAgentConfigs();

    cache.set(cacheKey, { data: configs, expiresAt: now + CACHE_TTL_MS });

    return NextResponse.json(configs, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Expires-In': String(CACHE_TTL_SECONDS),
        'Cache-Control': `private, max-age=${CACHE_TTL_SECONDS}`,
      },
    });
  } catch (error) {
    return jsonErrorFromUnknown('api/agents/list', error);
  }
}
