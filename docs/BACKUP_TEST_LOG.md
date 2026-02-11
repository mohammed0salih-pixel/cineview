# Backup Test Log

This document tracks monthly backup/restore testing to verify RTO and RPO targets.

| Date | Backup ID | Restore Time | Status | Issues |
|------|-----------|--------------|--------|--------|
| (Test results will be recorded here) | - | - | - | - |

## Test Procedure

Monthly backup restore tests validate:
- ✅ Backup completion (should complete in < 30 minutes)
- ✅ Restore success (should complete in < 30 minutes)
- ✅ Data integrity (all tables, users, analyses, audit logs)
- ✅ User authentication works post-restore
- ✅ Analysis pipeline works post-restore
- ✅ Export generation works post-restore

## Running the Test

```bash
export SUPABASE_PROJECT_ID="your-project-id"
export SUPABASE_ACCESS_TOKEN="your-token"
export STAGING_DB_ID="staging-project-id"

chmod +x scripts/test-backup.sh
scripts/test-backup.sh
```

## Success Criteria

- [ ] Backup created and completed
- [ ] Restore initiated to staging database
- [ ] Staging database becomes active
- [ ] Data validation passes (manual):
  - [ ] User count matches production
  - [ ] Project count matches production
  - [ ] Analysis records match production
  - [ ] Sample user can log in
  - [ ] Can run test analysis
  - [ ] Can generate PDF export
  - [ ] Audit log entries present

## RTO/RPO Targets

- **RTO (Recovery Time Objective):** 30 minutes
- **RPO (Recovery Point Objective):** 24 hours (1 day)

These tests ensure both targets are met.
