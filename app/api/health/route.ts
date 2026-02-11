import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getEnv } from '@/lib/env';

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    database: CheckResult;
    aiEngine: CheckResult;
    storage: CheckResult;
  };
  version: string;
}

interface CheckResult {
  status: 'pass' | 'fail';
  responseTime?: number;
  error?: string;
}

async function checkDatabase(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { status: 'fail', error: 'Missing Supabase configuration' };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error } = await supabase.from('projects').select('id').limit(1);
    
    if (error) throw error;
    
    return { status: 'pass', responseTime: Date.now() - start };
  } catch (error) {
    return { status: 'fail', responseTime: Date.now() - start, error: String(error) };
  }
}

async function checkAIEngine(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const aiEngineUrl = getEnv('AI_ENGINE_URL', 'http://localhost:8080') ?? 'http://localhost:8080';
    const response = await fetch(`${aiEngineUrl}/health`, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    return { status: 'pass', responseTime: Date.now() - start };
  } catch (error) {
    return { status: 'fail', responseTime: Date.now() - start, error: String(error) };
  }
}

async function checkStorage(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const SUPABASE_URL = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const SUPABASE_ANON_KEY = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return { status: 'fail', error: 'Missing Supabase configuration' };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error } = await supabase.storage.listBuckets();
    
    if (error) throw error;
    
    return { status: 'pass', responseTime: Date.now() - start };
  } catch (error) {
    return { status: 'fail', responseTime: Date.now() - start, error: String(error) };
  }
}

export async function GET() {
  const startTime = Date.now();

  const [database, aiEngine, storage] = await Promise.all([
    checkDatabase(),
    checkAIEngine(),
    checkStorage(),
  ]);

  const allPassing = database.status === 'pass' && aiEngine.status === 'pass' && storage.status === 'pass';
  const anyFailing = database.status === 'fail' || aiEngine.status === 'fail' || storage.status === 'fail';

  const healthCheck: HealthCheck = {
    status: allPassing ? 'healthy' : anyFailing ? 'unhealthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database,
      aiEngine,
      storage,
    },
    version: getEnv('npm_package_version', '1.0.0') ?? '1.0.0',
  };

  const statusCode = healthCheck.status === 'healthy' ? 200 : 503;

  return NextResponse.json(healthCheck, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
