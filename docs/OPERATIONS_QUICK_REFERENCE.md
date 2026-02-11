# Production Operations Quick Reference

Quick commands and procedures for production operations.

## Daily Operations

### Morning Health Check
```bash
# Check app health
curl https://your-app.com/api/health

# Check monitoring metrics
curl https://your-app.com/api/monitoring/status

# Expected: Both return 200 OK, error rate < 0.5%, P95 < 1500ms
```

### Monitor Dashboard
- **Sentry:** https://sentry.io/organizations/cineview/issues/
- **Supabase:** https://app.supabase.com/project/YOUR_PROJECT/backups
- **AWS:** https://console.aws.amazon.com/secretsmanager

### Check Recent Errors
```bash
# In Sentry Dashboard
1. Click "Issues"
2. Look for errors from last 24 hours
3. Review stack traces and affected users
4. Assign to team if needed
```

---

## Weekly Tasks

### Review Error Trends
```bash
# In Sentry
1. Go to "Stats" page
2. Review error rate trend (should be < 0.1%)
3. Check P95 latency trend (should be < 1500ms)
4. Review top error types
```

### Check Backup Status
```bash
# List recent backups
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/backups

# Expected: At least one successful backup from last 7 days
```

### Review Secrets
```bash
# List secrets (no values shown)
aws secretsmanager list-secrets --region us-east-1

# Check secret metadata
aws secretsmanager describe-secret \
  --secret-id cineview-supabase-service-role \
  --region us-east-1
```

---

## Monthly Tasks

### Test Backup Restore
```bash
# Run automated test
export SUPABASE_PROJECT_ID="your-project"
export SUPABASE_ACCESS_TOKEN="your-token"
export STAGING_DB_ID="staging-project"

chmod +x scripts/test-backup.sh
scripts/test-backup.sh

# Then manually validate in staging:
# - User login works
# - Can run analysis
# - Can download exports
# - Audit log present

# Update test log
echo "| $(date +%Y-%m-%d) | backup-id | 10 min | ✅ | Manual validation passed |" >> docs/BACKUP_TEST_LOG.md
```

### Rotate Secrets (If Needed)
```bash
# Update secret in AWS Secrets Manager
aws secretsmanager put-secret-value \
  --secret-id cineview-supabase-service-role \
  --secret-string "new-key-value" \
  --region us-east-1

# Verify app still works
npm run check:env

# Monitor Sentry for auth errors
```

### Review Performance Metrics
```bash
# In Sentry Performance
1. Click "Performance" tab
2. Review transaction types:
   - /api/analysis (should be < 2000ms)
   - /api/export (should be < 3000ms)
   - /api/ai/analyze (should be < 5000ms)
3. Identify slow transactions
4. Create performance improvement ticket if needed
```

---

## Incident Response

### Error Rate Spike (> 2%)
```bash
# 1. Check Sentry immediately
curl https://sentry.io/api/0/organizations/cineview/issues/

# 2. Identify error type and affected endpoints

# 3. Check recent deployments
# Go to Sentry → Releases

# 4. Check health of dependencies
curl https://your-app.com/api/health
# Check: database, AI engine, storage status

# 5. Contact on-call engineer
# Escalate to ops@cineview.ai if critical

# 6. If needed, trigger rollback
# See deployment procedure
```

### Slow Performance (P95 > 1500ms)
```bash
# 1. Check Sentry Performance tab
# Identify which endpoints are slow

# 2. Check database performance
# Supabase Dashboard → Database → Logs
# Look for slow queries

# 3. Check AI Engine status
curl http://ai-engine:8080/health

# 4. Check server resources
# CPU, memory, disk usage

# 5. Contact DevOps if needed
```

### Backup Failure
```bash
# 1. Check Supabase dashboard
# Backups page → Check status

# 2. If stuck, manually trigger
curl -X POST https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/backups \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "emergency-backup"}'

# 3. Monitor backup progress
# Supabase → Backups page

# 4. If critical, contact Supabase support
```

### Authentication Issues
```bash
# 1. Check auth service health
curl https://your-app.com/api/health

# 2. Verify Supabase is accessible
curl $NEXT_PUBLIC_SUPABASE_URL/rest/v1/

# 3. Check JWT secret in Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id cineview-supabase-service-role \
  --region us-east-1

# 4. Check Sentry for auth errors
# Should see specific error types in error feed

# 5. Restart auth service if needed
# Depends on deployment platform
```

---

## Deployment Procedures

### Pre-Deployment Checks
```bash
# 1. Run full test suite
npm run lint
npm run test
npm run build

# 2. Check environment
npm run check:env
# Expected: ✅ All checks pass

# 3. Review Sentry alert rules
# Make sure thresholds are appropriate

# 4. Check backup status
# Make sure recent backup exists
```

### Deployment
```bash
# 1. Deploy code (depends on your CI/CD)
# Usually automatic on git push to main

# 2. Monitor Sentry for deployment
# Sentry → Releases → Check latest release

# 3. Check health endpoints
curl https://your-app.com/api/health
curl https://your-app.com/api/monitoring/status

# 4. Monitor error rate for first hour
# Sentry dashboard should show < 0.5% error rate

# 5. If errors appear:
# - Check stack traces in Sentry
# - Review recent changes
# - Rollback if needed
```

### Rollback Procedure
```bash
# 1. Identify last stable version
# git log --oneline | head -20

# 2. Rollback deployment
# Depends on your deployment platform
# Usually: revert commit or redeploy previous version

# 3. Monitor in Sentry
# Should see error rate drop

# 4. Notify team of rollback
# Slack: #incidents

# 5. Schedule incident retrospective
```

---

## Alert Response Times

| Alert | Response Time | Owner |
|-------|---------------|-------|
| Error rate > 2% | 5 minutes | On-call engineer |
| P95 > 1500ms | 15 minutes | On-call engineer |
| AI Engine down | 5 minutes | On-call engineer |
| Backup failed | 1 hour | DevOps |
| Secret access error | 5 minutes | DevOps |

---

## Escalation Contacts

```
On-Call Engineer: ops@cineview.ai
DevOps Lead: devops@cineview.ai
Engineering Lead: engineering@cineview.ai
Sentry Support: https://sentry.io/support
Supabase Support: https://supabase.com/support
AWS Support: https://console.aws.amazon.com/support
```

---

## Useful URLs

| Service | URL |
|---------|-----|
| Sentry Dashboard | https://sentry.io/organizations/cineview/issues/ |
| Sentry Performance | https://sentry.io/organizations/cineview/performance/ |
| Supabase Dashboard | https://app.supabase.com/project/YOUR_PROJECT |
| AWS Secrets Manager | https://console.aws.amazon.com/secretsmanager |
| App Health | https://your-app.com/api/health |
| Monitoring | https://your-app.com/api/monitoring/status |

---

## Useful Commands

### Check Everything
```bash
# Full health check
echo "=== App Health ===" && curl https://your-app.com/api/health && \
echo -e "\n=== Monitoring ===" && curl https://your-app.com/api/monitoring/status && \
echo -e "\n=== Env ===" && npm run check:env
```

### Tail Logs
```bash
# App logs (depends on deployment platform)
# Example for Docker:
docker logs -f cineview-app

# AI Engine logs:
docker logs -f cineview-ai-engine
```

### Check Specific Error
```bash
# In Sentry, click on error and note the event ID
# Then search in logs:
grep "event-id-here" /var/log/app.log
```

### Manual Backup
```bash
curl -X POST https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/backups \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "manual-'$(date +%Y%m%d-%H%M%S)'"}'
```

### List Secrets
```bash
aws secretsmanager list-secrets --region us-east-1 --query 'SecretList[].Name'
```

---

## Common Issues & Solutions

### Issue: "Unauthorized - Invalid or missing API key"
```bash
# Solution: Check Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id cineview-ai-engine-api \
  --region us-east-1

# If missing, create it:
aws secretsmanager create-secret \
  --name cineview-ai-engine-api \
  --secret-string "your-key" \
  --region us-east-1
```

### Issue: High error rate in Sentry
```bash
# Solution: 
# 1. Check error types in Sentry
# 2. Review stack traces
# 3. Check if recent deployment introduced errors
# 4. If yes, consider rollback
# 5. If no, check external dependencies (Gemini, Supabase)
```

### Issue: Backup failed
```bash
# Solution:
# 1. Check Supabase status page
# 2. Try manual backup via Supabase dashboard
# 3. If still failing, contact Supabase support
# 4. Verify there's a recent backup (24 hours max)
```

### Issue: Database connection errors
```bash
# Solution:
# 1. Check Supabase status
# 2. Verify Supabase credentials in Secrets Manager
# 3. Check if database has reached connection limit
# 4. Restart app to clear connection pool
```

---

## Maintenance Windows

**Scheduled Maintenance:**
- Database backups: Daily 2 AM UTC (minimal impact)
- Sentry cleanup: Daily 3 AM UTC (no impact)
- No scheduled downtime for app

**Emergency Maintenance:**
- Communicated via Slack #status
- Typically < 30 minutes
- Rollback plan prepared

---

Last Updated: 2024
