import { NextRequest, NextResponse } from 'next/server';
import { SwarmsAPIClient } from '@/lib/api/swarms-client';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key') || process.env.SWARMS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing swarms_api_key. Please enter your API key to continue.' },
      { status: 401 }
    );
  }

  try {
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    const { agent_config, task, ...options } = body;

    if (!agent_config || !task) {
      return NextResponse.json(
        { error: 'agent_config and task are required' },
        { status: 400 }
      );
    }

    const client = new SwarmsAPIClient(
      apiKey,
      process.env.SWARMS_API_BASE_URL
    );

    const result = await client.executeAgent(agent_config, task, options);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error:', error);

    // Extract error message and status from APIError
    const errorMessage = error.message || 'Failed to execute agent';
    const errorStatus = error.status || 500;

    return NextResponse.json(
      {
        error: errorMessage,
        status: errorStatus,
        code: error.code,
      },
      { status: errorStatus }
    );
  }
}
