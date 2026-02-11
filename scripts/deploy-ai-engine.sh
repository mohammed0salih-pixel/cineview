#!/bin/bash
set -e

# Deploy AI Engine to AWS AppRunner

echo "🚀 Deploying AI Engine to AWS AppRunner"
echo "========================================"
echo ""

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found"
    exit 1
fi

if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS not configured"
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}

echo "Building AI Engine image..."
docker build -t cineview-ai-engine:latest ai-engine/ --quiet
echo "✅ Built"

echo ""
echo "Creating ECR repository..."
aws ecr create-repository \
    --repository-name cineview-ai-engine \
    --region $AWS_REGION 2>/dev/null || echo "  (Already exists)"

echo ""
echo "Pushing to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
    docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com > /dev/null 2>&1

docker tag cineview-ai-engine:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-ai-engine:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-ai-engine:latest > /dev/null 2>&1
echo "✅ Pushed to ECR"

echo ""
echo "Creating AppRunner service..."

ROLE_ARN=$(aws iam get-role --role-name cineview-apprunner-role --query 'Role.Arn' --output text)

aws apprunner create-service \
    --service-name cineview-ai-engine \
    --source-configuration ImageRepository={ImageIdentifier=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/cineview-ai-engine:latest,ImageRepositoryType=ECR,ImageConfiguration="{Port=8080}"}} \
    --instance-configuration "InstanceRoleArn=$ROLE_ARN,Cpu=2 vCPU,Memory=4 GB" \
    --health-check-configuration "Protocol=HTTP,Path=/health,Interval=10,Timeout=5,HealthyThreshold=2" \
    > /dev/null 2>&1 || echo "Service may already exist"

echo "✅ Service created"

echo ""
echo "⏳ Waiting for deployment (2-3 minutes)..."

SERVICE_ARN="arn:aws:apprunner:$AWS_REGION:$AWS_ACCOUNT_ID:service/cineview-ai-engine"

for i in {1..60}; do
    STATUS=$(aws apprunner describe-service --service-arn $SERVICE_ARN --query 'Service.Status' --output text 2>/dev/null || echo "INITIALIZING")
    
    if [ "$STATUS" = "RUNNING" ]; then
        echo ""
        echo "✅ AI Engine service is RUNNING!"
        break
    fi
    
    printf "."
    sleep 3
done

echo ""
echo "Getting URL..."
AI_ENGINE_URL=$(aws apprunner describe-service \
    --service-arn $SERVICE_ARN \
    --query 'Service.ServiceUrl' \
    --output text)

echo ""
echo "🎉 AI Engine deployed!"
echo ""
echo "URL: https://$AI_ENGINE_URL"
echo ""
echo "Add to main app environment variable:"
echo "  AI_ENGINE_URL=https://$AI_ENGINE_URL"
echo ""

# Save for reference
echo "https://$AI_ENGINE_URL" > /tmp/ai-engine-url.txt
