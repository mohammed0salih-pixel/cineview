#!/bin/bash
set -e

# AWS Secrets Manager Setup Script
# This script creates secrets in AWS Secrets Manager for production

echo "🔐 Creating secrets in AWS Secrets Manager..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Install it first: https://aws.amazon.com/cli/"
    exit 1
fi

# Secrets to create
declare -A SECRETS=(
    ["cineview-supabase-service-role"]="SUPABASE_SERVICE_ROLE_KEY"
    ["cineview-ai-engine-api"]="AI_ENGINE_API_KEY"
    ["cineview-gemini-api"]="GEMINI_API_KEY"
    ["cineview-jwt-secret"]="SUPABASE_JWT_SECRET"
)

echo ""
echo "📋 Secrets to create:"
for secret_name in "${!SECRETS[@]}"; do
    echo "  - $secret_name"
done

echo ""
echo "⚠️  Please provide the values for each secret (enter to skip):"
echo ""

for secret_name in "${!SECRETS[@]}"; do
    var_name="${SECRETS[$secret_name]}"
    read -p "Enter value for $var_name: " secret_value
    
    if [ -z "$secret_value" ]; then
        echo "  ⏭️  Skipping $secret_name"
        continue
    fi
    
    echo "  Creating $secret_name..."
    aws secretsmanager create-secret \
        --name "$secret_name" \
        --description "CineView production secret: $var_name" \
        --secret-string "$secret_value" \
        --region us-east-1 \
        2>/dev/null || echo "    ℹ️  Secret already exists (use update-secret to rotate)"
done

echo ""
echo "✅ Secrets setup complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Update your deployment environment to read from these secrets"
echo "  2. Use AWS IAM roles to grant access to the app container"
echo "  3. Set env vars from Secrets Manager in your deployment"
echo ""
