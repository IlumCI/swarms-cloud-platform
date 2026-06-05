import { NextRequest, NextResponse } from 'next/server';
import { SwarmsAPIClient } from '@/lib/api/swarms-client';
import { SwarmSpec } from '@/types/api';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || process.env.SWARMS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing swarms_api_key. Please enter your API key to continue.' },
      { status: 401 }
    );
  }

  let body: SwarmSpec;
  try {
    body = (await request.json()) as SwarmSpec;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json(
      { error: 'Request body must be a SwarmSpec object' },
      { status: 400 }
    );
  }

  if (!body.task || !body.task.trim()) {
    return NextResponse.json(
      { error: 'A task is required to run the swarm' },
      { status: 400 }
    );
  }

  if (!body.agents || body.agents.length === 0) {
    return NextResponse.json(
      { error: 'At least one agent is required' },
      { status: 400 }
    );
  }

  try {
    const client = new SwarmsAPIClient(
      apiKey,
      process.env.SWARMS_API_BASE_URL
    );
    const result = await client.runSwarm(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Swarm execution error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to execute swarm',
        status: error.status || 500,
        code: error.code,
      },
      { status: error.status || 500 }
    );
  }
}
