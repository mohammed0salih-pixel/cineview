# Production Setup: Secrets Manager + Sentry + Backups

This guide covers the complete setup for production deployment with AWS Secrets Manager, Sentry monitoring, and Supabase automated backups.

## 1. AWS Secrets Manager (Secrets Management)

### 1.1 Prerequisites
- AWS Account with appropriate IAM permissions
- AWS CLI installed: https://aws.amazon.com/cli/

### 1.2 Create Secrets
```bash
# Run the setup script
chmod +x scripts/setup-aws-secrets.sh
scripts/setup-aws-secrets.sh

# Or manually create secrets via AWS CLI:
aws secretsmanager create-secret \
    --name cineview-supabase-service-role \
    --secret-string "your-supabase-service-role-key" \
    --region us-east-1

aws secretsmanager create-secret \
    --name cineview-ai-engine-api \
    --secret-string "your-ai-engine-api-key" \
    --region us-east-1

aws secretsmanager create-secret \
    --name cineview-gemini-api \
    --secret-string "your-gemini-api-key" \
    --region us-east-1
```

### 1.3 Configure IAM Permissions
Create an IAM policy for your application:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": [
        "arn:aws:secretsmanager:us-east-1:ACCOUNT-ID:secret:cineview-*"
      ]
    }
  ]
}
```

### 1.4 Application Integration
The app automatically uses AWS Secrets Manager when deployed:
- Add AWS credentials to your deployment environment (EC2 role, ECS task role, Lambda execution role, etc.)
- The `getSecret()` function in `lib/secrets-manager.ts` handles retrieval and caching
- Falls back to environment variables in development

### 1.5 Verify Secrets Access
```bash
npm run check:env
```

This validates that all required secrets are accessible.

### 1.6 Secret Rotation
To rotate a secret:
```bash
aws secretsmanager put-secret-value \
    --secret-id cineview-supabase-service-role \
    --secret-string "new-key-value" \
    --region us-east-1
```

**Rotation Cadence:**
- Critical secrets (Supabase Service Role): Every 90 days
- API keys (Gemini, AI Engine): Every 180 days
- Test rotation in staging before production

## 2. Sentry (Monitoring & Error Tracking)

### 2.1 Create Sentry Project
1. Go to https://sentry.io
2. Sign up or log in
3. Create a new organization: "CineView"
4. Create a new project: "Next.js" platform
5. Copy your DSN (Data Source Name)

### 2.2 Environment Configuration
Add to your deployment environment:
```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://YOUR_KEY@sentry.io/PROJECT_ID
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_PROFILES_SAMPLE_RATE=0.05
```

### 2.3 Application Integration
Sentry is automatically initialized in `lib/sentry-init.ts`:
- Captures errors and exceptions
- Tracks performance metrics
- Records session replays on error
- Breadcrumb tracking for debugging

### 2.4 Monitoring Configuration

**Performance Thresholds:**
- P95 response time: 1500ms (warning) / 3000ms (critical)
- Error rate: 2% (warning) / 5% (critical)
- AI Engine availability: 99.5%

**Alert Rules in Sentry:**
1. **Error Rate Alert**
   - Condition: When error rate > 2% over 5 minutes
   - Action: Send to ops@cineview.ai

2. **Performance Alert**
   - Condition: When P95 > 1500ms over 5 minutes
   - Action: Send to ops@cineview.ai

3. **Availability Alert**
   - Condition: When Health check fails 3+ times
   - Action: Send to ops@cineview.ai (critical)

### 2.5 Custom Error Tracking
Use in your API routes:
```typescript
import { captureException, addBreadcrumb } from '@/lib/sentry-init';

// Capture an error
try {
  await analyzeImage(imageData);
} catch (error) {
  captureException(error, {
    context: 'image-analysis',
    imageSize: imageData.size,
  });
}

// Add breadcrumbs for debugging
addBreadcrumb('User started analysis', 'action');
```

### 2.6 AI Engine Monitoring
Monitor AI service in `ai-engine/index.js`:
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

// Wrap endpoints
app.post('/analyze', Sentry.traceErrors(async (req, res) => {
  // Your analysis code
}));
```

## 3. Supabase Automated Backups

### 3.1 Enable Automated Backups
1. Go to Supabase Dashboard
2. Select your project
3. Settings → Database → Backup
4. Enable "Automated daily backups"
5. Set retention period: 30 days

### 3.2 Backup Configuration
- **Frequency:** Daily at 2 AM UTC
- **Retention:** 30 days (keep last 30 daily backups)
- **Storage:** Automatic (no cost for included backups)

### 3.3 Manual Backups
To create a manual backup:
```bash
# Via Supabase CLI
supabase db backup create --project-ref YOUR_PROJECT_ID

# Or via API
curl -X POST https://api.supabase.com/v1/projects/YOUR_PROJECT_ID/backups \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "pre-deploy-backup"}'
```

### 3.4 Restore from Backup
**In Supabase Dashboard:**
1. Go to Backups page
2. Select the backup to restore
3. Click "Restore"
4. Confirm the action (warning: this will overwrite current data)

**Important:**
- Test restore in staging environment first
- Verify data integrity after restore
- Check that user records and analysis data are intact

### 3.5 Backup Testing Procedure
Run this monthly to verify backup/restore works:

```bash
# 1. Create a test database (staging environment)
# This is done once during infrastructure setup

# 2. Create a test backup
supabase db backup create --project-ref YOUR_PROJECT_ID --name "monthly-test-$(date +%Y-%m-%d)"

# 3. Restore to staging
# Use Supabase dashboard or API to restore latest backup to staging DB

# 4. Run validation
npm run test:staging

# 5. Check data integrity
# - Verify user accounts exist
# - Run sample analysis
# - Download export to confirm data export pipeline
# - Check audit log entries

# 6. Document results
echo "✅ Backup/restore successful on $(date)" >> docs/BACKUP_TEST_LOG.md
```

### 3.6 Backup SLA

| Metric | Target | Definition |
|--------|--------|-----------|
| RTO (Recovery Time Objective) | 30 minutes | Time to restore from backup |
| RPO (Recovery Point Objective) | 24 hours | Maximum data loss acceptable |
| Backup Frequency | Daily | Automated daily backup at 2 AM UTC |
| Retention Period | 30 days | Keep last 30 daily backups |
| Test Frequency | Monthly | Test restore in staging |

### 3.7 Disaster Recovery
In case of data loss:
1. **Immediate:** Disable write operations to prevent further data loss
   ```bash
   curl -X POST https://api.supabase.com/v1/projects/YOUR_PROJECT_ID/disable-writes \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

2. **Assessment:** Check backup age and data scope affected
   - If < 24 hours old: Restore the entire database
   - If > 24 hours old: Discuss with team on data re-entry options

3. **Restore:** Use Supabase dashboard to restore from appropriate backup

4. **Validation:** Run health check
   ```bash
   npm run check:health
   ```

5. **Communication:** Notify stakeholders of data loss scope and restoration timeline

## 4. Deployment Checklist

Before deploying to production:

- [ ] **Secrets Manager**
  - [ ] AWS Secrets Manager configured
  - [ ] All 3 secrets created (Supabase, AI Engine, Gemini)
  - [ ] IAM role attached to deployment environment
  - [ ] `npm run check:env` passes

- [ ] **Sentry**
  - [ ] Sentry project created
  - [ ] DSN added to environment variables
  - [ ] Error alerts configured (> 2% rate)
  - [ ] Performance alerts configured (P95 > 1500ms)
  - [ ] AI Engine monitoring added

- [ ] **Backups**
  - [ ] Automated backups enabled in Supabase
  - [ ] Retention set to 30 days
  - [ ] Manual backup created as baseline
  - [ ] Backup restore tested in staging
  - [ ] All validation checks passed

- [ ] **General**
  - [ ] All environment variables configured
  - [ ] Health checks passing (app + AI engine + database)
  - [ ] CI/CD pipeline green
  - [ ] Load testing completed
  - [ ] Security audit completed
  - [ ] Documentation up to date

## 5. Monitoring & Maintenance

### Daily Checks
- [ ] Sentry error rate < 2%
- [ ] No critical alerts in past 24 hours
- [ ] Health check endpoint returning 200

### Weekly Checks
- [ ] Review error trends in Sentry
- [ ] Check backup completion status
- [ ] Verify performance metrics (P95 < 1500ms)

### Monthly Checks
- [ ] Test backup restore in staging
- [ ] Review and rotate secrets if needed
- [ ] Update monitoring thresholds if needed
- [ ] Review and document any incidents

## 6. Quick Commands

```bash
# Check environment is production-ready
npm run check:env

# Create a manual backup
supabase db backup create --project-ref YOUR_PROJECT_ID

# View Sentry errors
# Visit: https://sentry.io/organizations/YOUR_ORG/issues/

# Check app health
curl https://your-app.com/api/health

# View monitoring data
npm run monitoring:summary
```

## 7. Support & Escalation

- **Secrets Issues:** AWS Secrets Manager documentation / AWS Support
- **Monitoring Issues:** Sentry support / ops@cineview.ai
- **Backup Issues:** Supabase support / database team
- **Production Incidents:** ops@cineview.ai (critical), team Slack (non-critical)
