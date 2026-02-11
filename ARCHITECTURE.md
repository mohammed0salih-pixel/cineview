# Architecture

## Overview

CineView AI is a Next.js app with server routes and a separated decision engine. The UI renders results produced by the decision layer without embedding business rules in components.

## Key Layers

- UI (app/_, components/_): presentation only.
- API (app/api/\*): request validation, auth, orchestration.
- Decision Engine (lib/decision-engine.ts): deterministic reasoning.
- Storage/Auth: Supabase client helpers in lib/\*.

## Data Flow (High Level)

1. Client submits analysis request.
2. API validates and enriches input.
3. Decision engine computes outputs.
4. Results stored and returned to UI.

## Determinism

Decision engine uses only input data and rule-based scoring. No randomness is used.

## Security Boundaries

- Secrets are read from env/secret files on server routes only.
- Client receives sanitized outputs and never sees server keys.
