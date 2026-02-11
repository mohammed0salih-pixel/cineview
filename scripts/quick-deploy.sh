#!/bin/bash
set -e

echo "🚀 Quick AWS AppRunner Deployment"
echo "==================================="

# Config
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="956651462373"
ECR_REPO="cineview-app"
SERVICE_NAME="cineview-app"

# Step 1: Check AWS is configured
echo ""
echo "Step 1: Verifying AWS credentials..."
if ! aws sts get-caller-identity &>/dev/null; then
  echo "❌ AWS not configured"
  exit 1
fi
echo "✅ AWS configured: Account $AWS_ACCOUNT_ID"

# Step 2: Get Docker credentials (non-interactive)
echo ""
echo "Step 2: Authenticating with ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com" 2>/dev/null && \
  echo "✅ Authenticated with ECR"

# Step 3: Create ECR repo if it doesn't exist
echo ""
echo "Step 3: Creating ECR repository..."
aws ecr create-repository \
  --repository-name "$ECR_REPO" \
  --region "$AWS_REGION" 2>/dev/null || echo "ℹ️  Repository already exists"

# Step 4: Get ECR repo URI
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO"
echo "✅ ECR URI: $ECR_URI"

# Step 5: Build and push
echo ""
echo "Step 5: Building and pushing Docker image..."
docker build --no-cache -q -t "$ECR_URI:latest" . || {
  echo "❌ Docker build failed"
  exit 1
}

echo "✅ Docker image built, pushing to ECR..."
docker push "$ECR_URI:latest" || {
  echo "❌ Failed to push image to ECR"
  exit 1
}
echo "✅ Image pushed to ECR"

# Step 6: Create AppRunner service
echo ""
echo "Step 6: Creating/Updating AppRunner service..."

# Check if service exists
if aws apprunner describe-service --service-arn "arn:aws:apprunner:$AWS_REGION:$AWS_ACCOUNT_ID:service/$SERVICE_NAME" \
  --region "$AWS_REGION" &>/dev/null 2>&1; then
  echo "ℹ️  Service exists, updating..."
  aws apprunner update-service \
    --service-arn "arn:aws:apprunner:$AWS_REGION:$AWS_ACCOUNT_ID:service/$SERVICE_NAME" \
    --source-configuration ImageRepository='{ImageRepositoryType=ECR,ImageIdentifier='$ECR_URI:latest',RepositoryAccessRoleArn=arn:aws:iam::'$AWS_ACCOUNT_ID':role/ecsTaskExecutionRole}' \
    --region "$AWS_REGION" 2>/dev/null || echo "ℹ️  Update queued"
else
  echo "ℹ️  Creating new service..."
  aws apprunner create-service \
    --service-name "$SERVICE_NAME" \
    --source-configuration ImageRepository='{ImageRepositoryType=ECR,ImageIdentifier='$ECR_URI:latest',RepositoryAccessRoleArn=arn:aws:iam::'$AWS_ACCOUNT_ID':role/ecsTaskExecutionRole}' \
    --instance-configuration Cpu=1vCPU,Memory=2GB,InstanceRoleArn=arn:aws:iam::'$AWS_ACCOUNT_ID':role/ecsTaskExecutionRole \
    --region "$AWS_REGION" 2>/dev/null || echo "ℹ️  Service creation in progress"
fi

# Step 7: Get service URL
echo ""
echo "Step 7: Getting AppRunner service URL..."
sleep 5

SERVICE_ARN="arn:aws:apprunner:$AWS_REGION:$AWS_ACCOUNT_ID:service/$SERVICE_NAME"
SERVICE_URL=$(aws apprunner describe-service \
  --service-arn "$SERVICE_ARN" \
  --region "$AWS_REGION" \
  --query 'Service.ServiceUrl' \
  --output text 2>/dev/null || echo "pending")

if [ "$SERVICE_URL" != "pending" ] && [ "$SERVICE_URL" != "None" ] && [ ! -z "$SERVICE_URL" ]; then
  echo ""
  echo "✅ Deployment complete!"
  echo ""
  echo "🌐 Your app is live at:"
  echo "   $SERVICE_URL"
  echo ""
  echo "📝 Save this URL for later: $SERVICE_URL"
  echo "$SERVICE_URL" > /tmp/cineview-url.txt
  
  # Test health endpoint
  echo ""
  echo "Testing health endpoint..."
  sleep 3
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SERVICE_URL/api/health" 2>/dev/null || echo "503")
  if [ "$STATUS" = "200" ]; then
    echo "✅ Health check passed!"
  else
    echo "⏳ Service still starting up (status: $STATUS), will be ready in ~2 minutes"
  fi
else
  echo "⏳ Service deployment in progress"
  echo "   Check progress in AWS Console:"
  echo "   https://console.aws.amazon.com/apprunner/home?region=$AWS_REGION"
fi

echo ""
echo "Done! 🎉"
