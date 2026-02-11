# Production Runbook

## 1) Secrets Management & Rotation

**Goal:** Store secrets in a secrets manager and rotate on a fixed cadence.

**Secrets:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `AI_ENGINE_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_JWT_SECRET`

**Steps**
1. Move all secrets to your secrets manager (AWS Secrets Manager, GCP Secret Manager, or Vault).
2. Replace direct env values with `*_FILE` references or injected runtime secrets.
3. Rotate keys:
   - Supabase service role key
   - AI engine API key
   - Gemini API key
   - JWT secret
4. Run `npm run check:env` in the deployment environment.

**Rotation cadence:** every 30–90 days or immediately after an incident.

---

## 2) Monitoring & Alerts

**Required signals**
- Uptime checks for `/api/health` (app + AI engine)
- Error rate alerts (4xx/5xx thresholds)
- Latency alerts (P95/P99)
- AI engine failure alerts

**Minimal setup**
- Add a health check monitor (StatusCake/UptimeRobot/New Relic).
- Add error tracking (Sentry/Datadog).
- Configure alert channels (email + Slack).

**Alert thresholds (suggested)**
- `/api/health` failure > 2 consecutive checks
- 5xx rate > 2% over 5 minutes
- P95 latency > 1500ms over 10 minutes

---

## 3) Backups & Restore Test

**Goal:** Verify RPO/RTO with a real restore.

**Steps**
1. Enable automated Supabase backups.
2. Perform a restore to a staging project.
3. Validate:
   - Users can sign in.
   - Latest `analysis_runs`, `creative_insights`, `exports` present.
   - Storage buckets accessible.
4. Record RPO and RTO in ops docs.

**Target:** RPO <= 24 hours, RTO <= 4 hours.

---

## 4) Go‑Live Checklist (Final)

- [ ] Secrets manager configured and verified
- [ ] Alerting configured for uptime, errors, and latency
- [ ] Backup + restore test completed
- [ ] `npm run check:env` passing in prod
- [ ] `npm run build` passing in CI
