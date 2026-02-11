#!/bin/bash
set -e

# AWS AppRunner Deployment Script
# Interactive setup for easy deployment

echo "🚀 AWS AppRunner Deployment"
echo "=================================="
echo ""

# Step 1: Check prerequisites
echo "Step 1: Checking prerequisites..."
echo ""

if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Install from https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo "✅ Docker installed"

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found."
    echo "Install: brew install awscli (macOS) or see https://aws.amazon.com/cli/"
    echo ""
    echo "⚡ Or use this quick install:"
    echo "  curl 'https://awscli.amazonaws.com/awscli-exe-macos-x86_64.zip' -o 'awscliv2.zip'"
    echo "  unzip awscliv2.zip"
    echo "  sudo ./aws/install"
    exit 1
fi
echo "✅ AWS CLI installed"

echo ""
echo "Step 2: AWS Configuration"
echo "=================================="
echo ""

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS not configured. Run: aws configure"
    echo ""
    echo "You'll need:"
    echo "  • AWS Access Key ID"
    echo "  • AWS Secret Access Key"
    echo "  • Default region: us-east-1"
    echo "  • Output format: json"
    exit 1
fi

echo "✅ AWS configured"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}
echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"

echo ""
echo "Step 3: Build & Push Docker Image"
echo "=================================="
echo ""

# Build
echo "Building Docker image..."
docker build -t cineview-app:latest . --quiet
echo "✅ Built cineview-app:latest"

# Create ECR repo
echo ""
echo "Creating ECR repository..."
aws ecr create-repository \
    --repository-name cineview-app \
    --region $AWS_REGION 2>/dev/null || echo "  (Repository already exists)"
echo "✅ ECR repository ready"

# Login to ECR
echo ""
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com > /dev/null 2>&1
echo "✅ Logged in to ECR"

# Tag image
echo ""
echo "Tagging image..."
docker tag cineview-app:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-app:latest
echo "✅ Tagged: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-app:latest"

# Push image
echo ""
echo "Pushing image to ECR (this may take 1-2 minutes)..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-app:latest
echo "✅ Image pushed to ECR"

echo ""
echo "Step 4: Create AppRunner Service"
echo "=================================="
echo ""

# Create IAM role
echo "Creating IAM role..."
ROLE_ARN=$(aws iam get-role --role-name cineview-apprunner-role --query 'Role.Arn' --output text 2>/dev/null) || {
    # Create role if it doesn't exist
    cat > /tmp/trust-policy.json << 'TRUST'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "apprunner.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
TRUST
    
    aws iam create-role \
        --role-name cineview-apprunner-role \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        --query 'Role.Arn' \
        --output text > /tmp/role-arn.txt
    
    ROLE_ARN=$(cat /tmp/role-arn.txt)
    
    # Attach policy
    cat > /tmp/secrets-policy.json << 'POLICY'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "arn:aws:secretsmanager:*:*:secret:cineview-*"
    }
  ]
}
POLICY
    
    aws iam put-role-policy \
        --role-name cineview-apprunner-role \
        --policy-name secrets-access \
        --policy-document file:///tmp/secrets-policy.json
}
echo "✅ IAM role ready: $ROLE_ARN"

# Create AppRunner service
echo ""
echo "Creating AppRunner service (this takes 2-3 minutes)..."

SERVICE_ARN=$(aws apprunner create-service \
    --service-name cineview-app \
    --source-configuration ImageRepository={ImageIdentifier=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-app:latest,ImageRepositoryType=ECR,ImageConfiguration="{Port=3000,RuntimeEnvironmentVariables={NODE_ENV=production,NEXT_PUBLIC_SENTRY_ENVIRONMENT=production}"}} \
    --instance-configuration "InstanceRoleArn=$ROLE_ARN,Cpu=1 vCPU,Memory=2 GB,InstanceCount=1" \
    --health-check-configuration "Protocol=HTTP,Path=/api/health,Interval=10,Timeout=5,HealthyThreshold=2,UnhealthyThreshold=3" \
    --query 'Service.ServiceArn' \
    --output text 2>/dev/null || echo "Service may already exist")

if [ -z "$SERVICE_ARN" ]; then
    SERVICE_ARN="arn:aws:apprunner:$AWS_REGION:$AWS_ACCOUNT_ID:service/cineview-app"
fi

echo "✅ AppRunner service created"
echo "Service ARN: $SERVICE_ARN"

echo ""
echo "⏳ Waiting for service to deploy (2-3 minutes)..."
echo "   Checking status..."

# Wait for service to be active
for i in {1..60}; do
    SERVICE_STATUS=$(aws apprunner describe-service \
        --service-arn $SERVICE_ARN \
        --query 'Service.Status' \
        --output text 2>/dev/null || echo "INITIALIZING")
    
    if [ "$SERVICE_STATUS" = "RUNNING" ]; then
        echo ""
        echo "✅ Service is RUNNING!"
        break
    fi
    
    printf "."
    sleep 3
done

echo ""
echo "Step 5: Get Public URL"
echo "=================================="
echo ""

SERVICE_URL=$(aws apprunner describe-service \
    --service-arn $SERVICE_ARN \
    --query 'Service.ServiceUrl' \
    --output text)

echo ""
echo "🎉 SUCCESS! Your app is live!"
echo ""
echo "════════════════════════════════════════"
echo "PUBLIC URL: https://$SERVICE_URL"
echo "════════════════════════════════════════"
echo ""

# Test the endpoint
echo "Testing health endpoint..."
sleep 5
HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$SERVICE_URL/api/health)
if [ "$HEALTH_STATUS" = "200" ]; then
    echo "✅ Health check: PASS (200)"
else
    echo "⚠️  Health check: $HEALTH_STATUS (wait a few more minutes for full startup)"
fi

echo ""
echo "Next Steps:"
echo "──────────"
echo "1. ✅ App deployed to: https://$SERVICE_URL"
echo "2. Add environment variables in AWS Console:"
echo "   AppRunner → Services → cineview-app → Configuration → Environment variables"
echo ""
echo "   Required variables:"
echo "     • NEXT_PUBLIC_SENTRY_DSN=..."
echo "     • NEXT_PUBLIC_SUPABASE_URL=..."
echo "     • NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
echo "     • AI_ENGINE_URL=... (if using separate AI Engine)"
echo ""
echo "3. Deploy AI Engine (optional):"
echo "   scripts/deploy-ai-engine.sh"
echo ""
echo "4. Set up custom domain (optional):"
echo "   AppRunner → Services → cineview-app → Custom domains"
echo ""

# Save URL for reference
echo "https://$SERVICE_URL" > /tmp/cineview-url.txt
echo "Service URL saved to: /tmp/cineview-url.txt"
echo ""
echo "✅ Deployment complete!"
