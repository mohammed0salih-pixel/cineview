# Production Implementation Checklist

This checklist covers all steps needed to implement AWS Secrets Manager, Sentry monitoring, and Supabase backups.

## Phase 1: AWS Secrets Manager Setup ✅

### Prerequisites
- [ ] AWS Account created
- [ ] AWS CLI installed and configured
- [ ] IAM user with SecretsManager permissions

### Implementation
- [ ] **Create Secrets**
  ```bash
  chmod +x scripts/setup-aws-secrets.sh
  scripts/setup-aws-secrets.sh
  ```
  - [ ] cineview-supabase-service-role
  - [ ] cineview-ai-engine-api
  - [ ] cineview-gemini-api

- [ ] **Configure IAM Policy**
  - [ ] Create IAM policy with SecretManager permissions
  - [ ] Attach to deployment role (EC2, ECS, Lambda, etc.)

- [ ] **Update Deployment Environment**
  - [ ] Add AWS credentials to deployment service
  - [ ] Set AWS_REGION environment variable
  - [ ] Test secret retrieval: `npm run check:env`

- [ ] **Code Integration**
  - [ ] ✅ Created `lib/secrets-manager.ts` for secret retrieval
  - [ ] ✅ Added AWS SDK to package.json
  - [ ] [ ] Test in production-like environment

### Verification
```bash
# Should all pass
npm run check:env

# Check application logs for any secret access errors
# Should see: "✅ All required secrets loaded"
```

## Phase 2: Sentry Setup ✅

### Create Sentry Project
- [ ] Visit https://sentry.io
- [ ] Sign up / Log in
- [ ] Create organization: "CineView"
- [ ] Create project: "Next.js" platform
- [ ] Copy DSN

### Environment Configuration
Add these environment variables to production:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_KEY@sentry.io/PROJECT_ID
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE=0.05
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_DEPLOYMENT_REGION=us-east-1
SENTRY_DSN=https://YOUR_KEY@sentry.io/PROJECT_ID (for AI Engine)
```

### Implementation
- [ ] ✅ Created `lib/sentry-init.ts` for app-side monitoring
- [ ] ✅ Added Sentry SDK to package.json
- [ ] ✅ Added Sentry SDK to ai-engine/package.json
- [ ] ✅ Created `lib/monitoring.ts` for performance tracking
- [ ] ✅ Created `app/api/monitoring/status/route.ts` endpoint
- [ ] [ ] Install dependencies: `npm install` (app) and `cd ai-engine && npm install`
- [ ] [ ] Test error capture in staging
- [ ] [ ] Test performance monitoring in staging

### Configure Alert Rules in Sentry
1. **Error Rate Alert**
   - [ ] Condition: Error rate > 2% over 5 minutes
   - [ ] Action: Send to ops@cineview.ai
   - [ ] Severity: Critical

2. **Performance Alert**
   - [ ] Condition: P95 response time > 1500ms over 5 minutes
   - [ ] Action: Send to ops@cineview.ai
   - [ ] Severity: Warning

3. **Health Check Failure Alert**
   - [ ] Condition: AI Engine health check fails 3+ times
   - [ ] Action: Send to ops@cineview.ai
   - [ ] Severity: Critical

### Monitoring Dashboard
- [ ] [ ] Set up custom dashboard in Sentry
  - [ ] Error rate widget
  - [ ] Response time percentiles (P50, P95, P99)
  - [ ] AI Engine availability
  - [ ] Top error types
  - [ ] Recent deployments

### Verification
```bash
# Test error capture
curl -X POST https://your-app.com/api/test-error

# Check Sentry dashboard
# Should see error within 1-2 minutes

# Check performance metrics
curl https://your-app.com/api/monitoring/status

# Response should include metric summary
```

## Phase 3: Supabase Backups Setup ✅

### Enable Automated Backups
1. [ ] Go to Supabase Dashboard
2. [ ] Select CineView project
3. [ ] Settings → Database → Backup
4. [ ] Enable "Automated daily backups"
5. [ ] Set retention: 30 days
6. [ ] Backup time: 2 AM UTC (or preferred time)

### Configuration
- [ ] ✅ Created `scripts/test-backup.sh` for monthly testing
- [ ] ✅ Created `docs/BACKUP_TEST_LOG.md` for tracking

### Monthly Backup Test
Run this every month to verify RTO/RPO:

```bash
# Set up test environment
export SUPABASE_PROJECT_ID="your-project-id"
export SUPABASE_ACCESS_TOKEN="your-access-token"
export STAGING_DB_ID="staging-project-id"

# Run test
chmod +x scripts/test-backup.sh
scripts/test-backup.sh
```

**Manual Validation Steps:**
- [ ] Connect to staging database
- [ ] Verify data counts:
  - [ ] User records match production
  - [ ] Project records match production
  - [ ] Analysis records match production
- [ ] Test functionality:
  - [ ] User login works
  - [ ] Can run test analysis
  - [ ] Can generate PDF export
  - [ ] Audit log entries present
- [ ] Document in BACKUP_TEST_LOG.md

### Backup SLA Targets
- [ ] RTO (Recovery Time Objective): 30 minutes
- [ ] RPO (Recovery Point Objective): 24 hours
- [ ] Backup Retention: 30 days
- [ ] Test Frequency: Monthly

### Disaster Recovery Plan
- [ ] RTO/RPO documented in PRODUCTION_SETUP.md
- [ ] Recovery steps documented
- [ ] Team trained on recovery procedure
- [ ] Recovery tested quarterly

### Verification
```bash
# Check backup status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.supabase.com/v1/projects/YOUR_PROJECT_ID/backups

# Should see recent backups with "COMPLETED" status
```

## Phase 4: Integration Testing

### Test Secrets Access
- [ ] Deploy app to staging environment
- [ ] Run: `npm run check:env`
- [ ] Check logs for successful secret retrieval
- [ ] Verify no secrets logged (security check)

### Test Error Monitoring
- [ ] Deploy app with Sentry DSN configured
- [ ] Trigger test error: `curl -X POST https://app/api/test-error`
- [ ] Wait 1-2 minutes
- [ ] Check Sentry dashboard - error should appear
- [ ] Verify AI Engine errors captured

### Test Performance Monitoring
- [ ] Run load test (100 requests)
- [ ] Check Sentry Performance tab
- [ ] Verify percentiles recorded (P50, P95, P99)
- [ ] Verify slow transactions identified

### Test Backup Recovery
- [ ] Run `scripts/test-backup.sh`
- [ ] Restore to staging database
- [ ] Run full validation suite
- [ ] Update BACKUP_TEST_LOG.md

## Phase 5: Production Deployment

### Pre-Deployment
- [ ] All Phase 1-4 tests passing
- [ ] Secrets Manager configured and tested
- [ ] Sentry alerts configured and tested
- [ ] Backup restore validated
- [ ] Team briefing completed

### Deployment Steps
1. [ ] Update production environment variables:
   - [ ] Sentry DSN
   - [ ] AWS region
   - [ ] Supabase project ID
2. [ ] Deploy application code
3. [ ] Verify health checks passing
4. [ ] Monitor Sentry for errors
5. [ ] Check performance metrics
6. [ ] Verify backup triggers (first automated backup)

### Post-Deployment Monitoring (First 24 Hours)
- [ ] Error rate < 0.5%
- [ ] P95 response time < 1500ms
- [ ] No critical errors in Sentry
- [ ] All health checks passing
- [ ] Backup completed successfully

## Phase 6: Ongoing Operations

### Daily (Automated)
- [ ] Sentry error monitoring (automatic)
- [ ] Performance monitoring (automatic)
- [ ] Database backup (automatic at 2 AM UTC)

### Weekly Tasks
- [ ] [ ] Review Sentry error trends
- [ ] [ ] Check backup completion
- [ ] [ ] Review performance metrics
- [ ] [ ] Check alert delivery

### Monthly Tasks
- [ ] [ ] Test backup restore (`scripts/test-backup.sh`)
- [ ] [ ] Review and rotate secrets if needed
- [ ] [ ] Update monitoring thresholds if needed
- [ ] [ ] Document any incidents

### Quarterly Tasks
- [ ] [ ] Full disaster recovery drill
- [ ] [ ] Audit Sentry alert rules
- [ ] [ ] Review backup retention policy
- [ ] [ ] Team training refresh

## Support & Escalation

| Issue | Support | Escalation |
|-------|---------|------------|
| Secrets Manager errors | AWS Support | ops@cineview.ai |
| Sentry configuration | Sentry docs / support | ops@cineview.ai |
| Backup failures | Supabase support | ops@cineview.ai (critical) |
| Production incident | ops@cineview.ai | Engineering lead |

## Completion Status

| Phase | Status | Date | Notes |
|-------|--------|------|-------|
| 1. Secrets Manager | ⏳ Ready to implement | - | Scripts and code created |
| 2. Sentry | ⏳ Ready to implement | - | SDK integrated, ready for project creation |
| 3. Backups | ⏳ Ready to implement | - | Test script and log file ready |
| 4. Integration Testing | ⏳ Pending | - | Will run after phases 1-3 setup |
| 5. Production Deployment | ⏳ Pending | - | Ready after integration tests pass |
| 6. Operations | ⏳ Pending | - | Will begin after production deployment |

## Quick Start Command

```bash
# 1. Set up Secrets Manager
chmod +x scripts/setup-aws-secrets.sh
scripts/setup-aws-secrets.sh

# 2. Create Sentry project at https://sentry.io
# 3. Set environment variables
# 4. Test environment
npm run check:env

# 5. Test backup (when ready)
export SUPABASE_PROJECT_ID="..."
export SUPABASE_ACCESS_TOKEN="..."
export STAGING_DB_ID="..."
scripts/test-backup.sh

# 6. Deploy and monitor
npm run build
npm start
```
