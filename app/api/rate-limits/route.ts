import { NextRequest, NextResponse } from 'next/server';
import SwarmsAPIClient from '@/lib/api/swarms-client';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key') || process.env.SWARMS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing swarms_api_key. Please enter your API key to continue.' },
        { status: 401 }
      );
    }

    const client = new SwarmsAPIClient(apiKey);
    const rateLimits = await client.getRateLimits();

    return NextResponse.json(rateLimits);
  } catch (error: any) {
    console.error('Error fetching rate limits:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch rate limits',
        status: error.status || 500,
      },
      { status: error.status || 500 }
    );
  }
}
