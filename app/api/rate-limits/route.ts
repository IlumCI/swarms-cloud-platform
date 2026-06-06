import { NextRequest, NextResponse } from 'next/server';
import SwarmsAPIClient from '@/lib/api/swarms-client';
import { resolveApiKey } from '@/lib/api/server-api-key';
import { jsonErrorFromUnknown } from '@/lib/api/errors';

const CACHE_TTL_MS = 20 * 1000;
const CACHE_TTL_SECONDS = 20;

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  try {
    const apiKey = await resolveApiKey();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'No Swarms API key found. Sign in or create one in your Swarms account.' },
        { status: 401 }
      );
    }

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

    const client = new SwarmsAPIClient(apiKey);
    const data = await client.getRateLimits();

    cache.set(cacheKey, { data, expiresAt: now + CACHE_TTL_MS });

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Expires-In': String(CACHE_TTL_SECONDS),
        'Cache-Control': `private, max-age=${CACHE_TTL_SECONDS}`,
      },
    });
  } catch (error) {
    return jsonErrorFromUnknown('api/rate-limits', error);
  }
}
