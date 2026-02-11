import { NextRequest, NextResponse } from 'next/server';
import { aiAnalyzeSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import { getEnv } from '@/lib/env';

const limiter = rateLimit({ windowMs: 60000, maxRequests: 10 });

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting based on IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp =
      (forwardedFor ? forwardedFor.split(',')[0]?.trim() : null) ||
      request.headers.get('x-real-ip') ||
      'unknown';
    const rateLimitResult = limiter(clientIp);
    if (rateLimitResult) {
      return rateLimitResult;
    }
    
    const body = await request.json();
    
    // Validate input
    const validationResult = aiAnalyzeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input', 
          details: validationResult.error.format() 
        },
        { status: 400 }
      );
    }
    
    const validatedBody = validationResult.data;
    
    // Forward request to AI Engine
    const aiEngineUrl = getEnv('AI_ENGINE_URL', 'http://localhost:8080') ?? 'http://localhost:8080';
    const aiEngineKey = getEnv('AI_ENGINE_API_KEY', '') ?? '';
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add API key if available
    if (aiEngineKey) {
      headers['x-api-key'] = aiEngineKey;
    }
    
    const response = await fetch(`${aiEngineUrl}/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify(validatedBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Engine error:', errorText);
      return NextResponse.json(
        { error: `AI Engine error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('AI proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect to AI Engine' },
      { status: 500 }
    );
  }
}
