const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_JWT_SECRET',
  'AI_ENGINE_URL',
  'NEXT_PUBLIC_SENTRY_DSN',
];

const optional = [
  'AWS_REGION',
  'SUPABASE_PROJECT_ID',
];

const secretPairs = [
  ['SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY_FILE'],
  ['AI_ENGINE_API_KEY', 'AI_ENGINE_API_KEY_FILE'],
  ['GEMINI_API_KEY', 'GEMINI_API_KEY_FILE'],
];

const missing = [];
const warnings = [];

for (const key of required) {
  if (!process.env[key]) missing.push(key);
}

for (const [direct, file] of secretPairs) {
  if (!process.env[direct] && !process.env[file]) {
    missing.push(`${direct} (or ${file})`);
  }
}

// Check optional variables for production
if (process.env.NODE_ENV === 'production') {
  for (const key of optional) {
    if (!process.env[key]) {
      warnings.push(key);
    }
  }
}

if (missing.length) {
  console.error('❌ Missing required environment variables:');
  for (const key of missing) {
    console.error(`  - ${key}`);
  }
  process.exit(1);
}

if (warnings.length) {
  console.warn('⚠️  Missing optional (production recommended) variables:');
  for (const key of warnings) {
    console.warn(`  - ${key}`);
  }
}

console.log('✅ Environment check passed.');
