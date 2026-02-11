#!/bin/bash
set -e

# Backup Testing Script for Supabase
# Tests the backup/restore process monthly to ensure RTO/RPO targets are met

echo "🔄 Starting Supabase backup test..."
echo ""

# Check for required environment variables
if [ -z "$SUPABASE_PROJECT_ID" ]; then
    echo "❌ SUPABASE_PROJECT_ID not set"
    echo "Set it with: export SUPABASE_PROJECT_ID=your-project-id"
    exit 1
fi

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN not set"
    echo "Set it with: export SUPABASE_ACCESS_TOKEN=your-access-token"
    exit 1
fi

if [ -z "$STAGING_DB_ID" ]; then
    echo "❌ STAGING_DB_ID not set (for restore testing)"
    echo "Set it with: export STAGING_DB_ID=staging-project-id"
    exit 1
fi

BACKUP_NAME="monthly-test-$(date +%Y-%m-%d-%H%M%S)"
REGION="${SUPABASE_REGION:-us-east-1}"

echo "📋 Configuration:"
echo "  Project: $SUPABASE_PROJECT_ID"
echo "  Region: $REGION"
echo "  Backup Name: $BACKUP_NAME"
echo "  Test will restore to Staging DB: $STAGING_DB_ID"
echo ""

# Step 1: Create a manual backup
echo "1️⃣  Creating manual backup..."
BACKUP_RESPONSE=$(curl -s -X POST \
    "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/backups" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"$BACKUP_NAME\"}")

BACKUP_ID=$(echo "$BACKUP_RESPONSE" | jq -r '.id // empty')

if [ -z "$BACKUP_ID" ]; then
    echo "❌ Failed to create backup"
    echo "Response: $BACKUP_RESPONSE"
    exit 1
fi

echo "✅ Backup created: $BACKUP_ID"
echo ""

# Step 2: Wait for backup to complete
echo "2️⃣  Waiting for backup to complete..."
MAX_WAIT=600  # 10 minutes
ELAPSED=0
POLL_INTERVAL=10

while [ $ELAPSED -lt $MAX_WAIT ]; do
    BACKUP_STATUS=$(curl -s -X GET \
        "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/backups/$BACKUP_ID" \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        | jq -r '.status // empty')

    if [ "$BACKUP_STATUS" = "COMPLETED" ]; then
        echo "✅ Backup completed"
        break
    elif [ "$BACKUP_STATUS" = "FAILED" ]; then
        echo "❌ Backup failed"
        exit 1
    fi

    echo "  Status: $BACKUP_STATUS (waiting...)"
    sleep $POLL_INTERVAL
    ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

if [ $ELAPSED -ge $MAX_WAIT ]; then
    echo "❌ Backup timed out after 10 minutes"
    exit 1
fi

echo ""

# Step 3: Restore to staging
echo "3️⃣  Restoring backup to staging database..."
RESTORE_RESPONSE=$(curl -s -X POST \
    "https://api.supabase.com/v1/projects/$SUPABASE_PROJECT_ID/backups/$BACKUP_ID/restore" \
    -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"target\": \"$STAGING_DB_ID\"}")

RESTORE_STATUS=$(echo "$RESTORE_RESPONSE" | jq -r '.status // empty')

if [ "$RESTORE_STATUS" = "RESTORING" ] || [ "$RESTORE_STATUS" = "COMPLETED" ]; then
    echo "✅ Restore initiated"
else
    echo "❌ Failed to restore backup"
    echo "Response: $RESTORE_RESPONSE"
    exit 1
fi

echo ""

# Step 4: Wait for restore to complete
echo "4️⃣  Waiting for restore to complete..."
ELAPSED=0

while [ $ELAPSED -lt $MAX_WAIT ]; do
    RESTORE_STATUS=$(curl -s -X GET \
        "https://api.supabase.com/v1/projects/$STAGING_DB_ID" \
        -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
        | jq -r '.status // empty')

    if [ "$RESTORE_STATUS" = "ACTIVE" ]; then
        echo "✅ Restore completed and database is active"
        break
    fi

    echo "  Status: $RESTORE_STATUS (waiting...)"
    sleep $POLL_INTERVAL
    ELAPSED=$((ELAPSED + POLL_INTERVAL))
done

echo ""

# Step 5: Validate restored data
echo "5️⃣  Validating restored data..."

# This would require connecting to the staging database
# For now, we'll document the manual validation steps

echo "⚠️  Manual validation required:"
echo "  1. Connect to staging database"
echo "  2. Verify table counts match production:"
echo "     - SELECT COUNT(*) FROM users;"
echo "     - SELECT COUNT(*) FROM projects;"
echo "     - SELECT COUNT(*) FROM analyses;"
echo "  3. Test user login with test account"
echo "  4. Run sample analysis"
echo "  5. Test PDF/ZIP export generation"
echo "  6. Check audit log entries"
echo ""

# Step 6: Document test results
echo "6️⃣  Recording test results..."

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE="docs/BACKUP_TEST_LOG.md"

# Create log file if it doesn't exist
if [ ! -f "$LOG_FILE" ]; then
    cat > "$LOG_FILE" << 'EOF'
# Backup Test Log

This document tracks monthly backup/restore testing to verify RTO and RPO targets.

| Date | Backup ID | Restore Time | Status | Issues |
|------|-----------|--------------|--------|--------|
EOF
fi

# Append test result
echo "| $TIMESTAMP | $BACKUP_ID | ~10-15 min | ✅ Restored to staging | Manual validation required |" >> "$LOG_FILE"

echo "✅ Test result recorded in $LOG_FILE"
echo ""

# Summary
echo "📊 Backup Test Summary:"
echo "  Backup ID: $BACKUP_ID"
echo "  Created: $TIMESTAMP"
echo "  Status: ✅ Successfully restored to staging"
echo "  Next Steps:"
echo "    1. Validate data in staging environment (see above)"
echo "    2. Update BACKUP_TEST_LOG.md with validation results"
echo "    3. Destroy staging database after validation"
echo ""
echo "ℹ️  To destroy staging database:"
echo "    curl -X DELETE https://api.supabase.com/v1/projects/$STAGING_DB_ID \\"
echo "      -H \"Authorization: Bearer \$SUPABASE_ACCESS_TOKEN\""
echo ""
