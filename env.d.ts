export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      NEXT_PUBLIC_APP_URL?: string;
      NEXT_PUBLIC_SUPABASE_URL?: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
      SUPABASE_JWT_SECRET?: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;
      SUPABASE_SERVICE_ROLE_KEY_FILE?: string;
      AI_ENGINE_URL?: string;
      AI_ENGINE_API_KEY?: string;
      AI_ENGINE_API_KEY_FILE?: string;
      GEMINI_API_KEY?: string;
      GEMINI_API_KEY_FILE?: string;
      OPENAI_API_KEY?: string;
      npm_package_version?: string;
      NEXT_PUBLIC_SENTRY_DSN?: string;
      NEXT_PUBLIC_SENTRY_ENVIRONMENT?: string;
      NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE?: string;
      NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE?: string;
      NEXT_PUBLIC_APP_VERSION?: string;
      NEXT_PUBLIC_DEPLOYMENT_REGION?: string;
      AWS_REGION?: string;
      SUPABASE_PROJECT_ID?: string;
      SUPABASE_ACCESS_TOKEN?: string;
    }
  }
}
