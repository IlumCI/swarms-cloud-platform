import { NextRequest, NextResponse } from 'next/server';
import SwarmsAPIClient from '@/lib/api/swarms-client';

const TEN_HOURS_MS = 10 * 60 * 60 * 1000;
const TEN_HOURS_SECONDS = 10 * 60 * 60;

type CacheEntry = {
  data: unknown;
  expiresAt: number;
};

const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  try {
    const apiKey =
      request.headers.get('x-api-key') || process.env.SWARMS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing swarms_api_key. Please enter your API key to continue.' },
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
          'Cache-Control': `public, max-age=${TEN_HOURS_SECONDS}`,
        },
      });
    }

    const client = new SwarmsAPIClient(apiKey, process.env.SWARMS_API_BASE_URL);
    const data = await client.getAvailableModels();

    cache.set(cacheKey, { data, expiresAt: now + TEN_HOURS_MS });

    return NextResponse.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'X-Cache-Expires-In': String(TEN_HOURS_SECONDS),
        'Cache-Control': `public, max-age=${TEN_HOURS_SECONDS}`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch available models',
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
