# New Project

Enterprise-grade creative analysis platform built on Next.js with a deterministic decision engine.

## Requirements

- Node.js 18+ (recommended 20 LTS)
- npm 9+

## Setup

```bash
npm install
```

Create a `.env.local` with required values (see `.env.example` if provided):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY_FILE` (Docker secrets path, e.g. `/run/secrets/supabase_service_role_key`)
- `CRON_SECRET` (optional)
- `SUPABASE_EXPORTS_BUCKET` (optional)

## Development

```bash
npm run dev
```

## Quality Gates

```bash
npm run lint
npm test
npm run build
npm audit
```

## Architecture & Decision Engine

- Architecture: `ARCHITECTURE.md`
- System overview: `SYSTEM_OVERVIEW.md`
- Decision engine: `DECISION_ENGINE.md`
- Product docs: `docs/README.md`

## Notes

- Decision logic is isolated in `lib/decision-engine.ts` and is deterministic.
- API routes act as orchestration layers only.
