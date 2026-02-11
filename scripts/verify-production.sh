#!/bin/bash

# Production Verification Script
# Checks that all three production systems are properly configured

echo "🔍 Production Readiness Verification"
echo "===================================="
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to run a check
run_check() {
    local name="$1"
    local command="$2"
    
    echo -n "Checking $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo "✅"
        ((CHECKS_PASSED++))
        return 0
    else
        echo "❌"
        ((CHECKS_FAILED++))
        return 0
    fi
}

# 1. Code structure checks
echo "📦 Code Structure"
run_check "lib/secrets-manager.ts exists" "test -f lib/secrets-manager.ts"
run_check "lib/sentry-init.ts exists" "test -f lib/sentry-init.ts"
run_check "lib/monitoring.ts exists" "test -f lib/monitoring.ts"
run_check "app/api/monitoring/status/route.ts exists" "test -f app/api/monitoring/status/route.ts"
run_check "components/monitoring-dashboard.tsx exists" "test -f components/monitoring-dashboard.tsx"
echo ""

# 2. Configuration checks
echo "⚙️  Configuration Files"
run_check "scripts/setup-aws-secrets.sh exists" "test -f scripts/setup-aws-secrets.sh"
run_check "scripts/test-backup.sh exists" "test -f scripts/test-backup.sh"
run_check "scripts/validate-env.mjs exists" "test -f scripts/validate-env.mjs"
echo ""

# 3. Documentation checks
echo "📚 Documentation"
run_check "PRODUCTION_SETUP.md exists" "test -f docs/PRODUCTION_SETUP.md"
run_check "PRODUCTION_IMPLEMENTATION_CHECKLIST.md exists" "test -f docs/PRODUCTION_IMPLEMENTATION_CHECKLIST.md"
run_check "BACKUP_TEST_LOG.md exists" "test -f docs/BACKUP_TEST_LOG.md"
run_check "PRODUCTION_SYSTEMS_SUMMARY.md exists" "test -f docs/PRODUCTION_SYSTEMS_SUMMARY.md"
run_check "OPERATIONS_QUICK_REFERENCE.md exists" "test -f docs/OPERATIONS_QUICK_REFERENCE.md"
echo ""

# 4. Dependencies check
echo "📦 Dependencies"
run_check "@aws-sdk/client-secrets-manager in package.json" "grep -q '@aws-sdk/client-secrets-manager' package.json"
run_check "@sentry/nextjs in package.json" "grep -q '@sentry/nextjs' package.json"
run_check "@sentry/node in ai-engine/package.json" "grep -q '@sentry/node' ai-engine/package.json"
echo ""

# 5. Type definitions check
echo "🔧 Type Definitions"
run_check "Sentry vars in env.d.ts" "grep -q 'NEXT_PUBLIC_SENTRY_DSN' env.d.ts"
run_check "AWS vars in env.d.ts" "grep -q 'AWS_REGION' env.d.ts"
run_check "Backup vars in env.d.ts" "grep -q 'SUPABASE_PROJECT_ID' env.d.ts"
echo ""

# 6. Script permissions check
echo "🔐 Script Permissions"
if test -f scripts/setup-aws-secrets.sh; then
    if test -x scripts/setup-aws-secrets.sh; then
        echo "✅ setup-aws-secrets.sh is executable"
        ((CHECKS_PASSED++))
    else
        echo "⚠️  setup-aws-secrets.sh is not executable (run: chmod +x scripts/setup-aws-secrets.sh)"
        ((CHECKS_FAILED++))
    fi
fi

if test -f scripts/test-backup.sh; then
    if test -x scripts/test-backup.sh; then
        echo "✅ test-backup.sh is executable"
        ((CHECKS_PASSED++))
    else
        echo "⚠️  test-backup.sh is not executable (run: chmod +x scripts/test-backup.sh)"
        ((CHECKS_FAILED++))
    fi
fi
echo ""

# 7. Environment variables check (if running in production context)
if [ ! -z "$NEXT_PUBLIC_SENTRY_DSN" ]; then
    echo "🌍 Production Environment Variables"
    run_check "NEXT_PUBLIC_SENTRY_DSN is set" "test -n '$NEXT_PUBLIC_SENTRY_DSN'"
    run_check "AWS_REGION is set" "test -n '$AWS_REGION'"
    
    if command -v npm &> /dev/null; then
        echo -n "Checking npm check:env script... "
        if npm run check:env > /dev/null 2>&1; then
            echo "✅"
            ((CHECKS_PASSED++))
        else
            echo "❌"
            ((CHECKS_FAILED++))
        fi
    fi
    echo ""
fi

# Summary
echo "===================================="
echo "📊 Verification Summary"
echo "===================================="
echo "✅ Passed: $CHECKS_PASSED"
echo "❌ Failed: $CHECKS_FAILED"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo "🎉 All checks passed! System is production-ready."
    echo ""
    echo "📝 Next steps:"
    echo "  1. Create AWS Secrets Manager secrets:"
    echo "     chmod +x scripts/setup-aws-secrets.sh"
    echo "     scripts/setup-aws-secrets.sh"
    echo ""
    echo "  2. Create Sentry project at https://sentry.io"
    echo ""
    echo "  3. Enable Supabase automated backups"
    echo "     Dashboard → Settings → Database → Backup"
    echo ""
    echo "  4. Set environment variables in production"
    echo ""
    echo "  5. Deploy application"
    echo ""
    echo "  6. Verify monitoring:"
    echo "     curl https://your-app.com/api/health"
    echo "     curl https://your-app.com/api/monitoring/status"
    echo ""
    echo "See docs/PRODUCTION_IMPLEMENTATION_CHECKLIST.md for detailed steps."
    exit 0
else
    echo "⚠️  Some checks failed. Please review the issues above."
    echo ""
    echo "Common fixes:"
    echo "  - Make scripts executable: chmod +x scripts/*.sh"
    echo "  - Run 'npm install' to install dependencies"
    echo "  - Check that all files are in correct locations"
    echo ""
    exit 1
fi
