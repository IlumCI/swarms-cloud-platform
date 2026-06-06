import { NextRequest, NextResponse } from 'next/server';
import { SwarmsAPIClient } from '@/lib/api/swarms-client';
import { resolveApiKey } from '@/lib/api/server-api-key';
import { jsonErrorFromUnknown } from '@/lib/api/errors';
import { SwarmSpec } from '@/types/api';

export async function POST(request: NextRequest) {
  const apiKey = await resolveApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: 'No Swarms API key found. Sign in or create one in your Swarms account.' },
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
  } catch (error) {
    return jsonErrorFromUnknown('api/swarm', error);
  }
}
