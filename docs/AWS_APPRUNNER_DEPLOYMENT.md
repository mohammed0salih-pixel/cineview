# AWS AppRunner Deployment Guide

Deploy your Next.js app to AWS AppRunner with integrated Secrets Manager.

## Prerequisites

- AWS Account with AppRunner access
- Docker image pushed to ECR (Elastic Container Registry)
- AWS CLI configured: `aws configure`

## Step 1: Push Docker Image to ECR

```bash
# Set variables
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME=cineview-app
IMAGE_TAG=latest

# Create ECR repository
aws ecr create-repository \
  --repository-name $ECR_REPO_NAME \
  --region $AWS_REGION 2>/dev/null || true

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push
docker build -t $ECR_REPO_NAME:$IMAGE_TAG .

docker tag $ECR_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG

docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG

echo "Image pushed to: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG"
```

## Step 2: Create IAM Role for AppRunner

```bash
# Create trust policy
cat > /tmp/apprunner-trust.json << 'EOF'
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
EOF

# Create role
aws iam create-role \
  --role-name cineview-apprunner-role \
  --assume-role-policy-document file:///tmp/apprunner-trust.json

# Create policy for Secrets Manager access
cat > /tmp/apprunner-policy.json << 'EOF'
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
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Attach policy
aws iam put-role-policy \
  --role-name cineview-apprunner-role \
  --policy-name cineview-secrets-policy \
  --policy-document file:///tmp/apprunner-policy.json
```

## Step 3: Create AppRunner Service

```bash
# Variables
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME=cineview-app
IMAGE_TAG=latest
ROLE_ARN="arn:aws:iam::$AWS_ACCOUNT_ID:role/cineview-apprunner-role"

# Create AppRunner service
aws apprunner create-service \
  --region $AWS_REGION \
  --service-name cineview-app \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "'$AWS_ACCOUNT_ID'.dkr.ecr.'$AWS_REGION'.amazonaws.com/'$ECR_REPO_NAME':'$IMAGE_TAG'",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "RuntimeEnvironmentVariables": {
          "NODE_ENV": "production",
          "NEXT_PUBLIC_SENTRY_ENVIRONMENT": "production"
        },
        "Port": "3000"
      }
    }
  }' \
  --instance-configuration '{
    "InstanceRoleArn": "'$ROLE_ARN'",
    "Cpu": "1 vCPU",
    "Memory": "2 GB",
    "InstanceCount": 1
  }' \
  --health-check-configuration '{
    "Protocol": "HTTP",
    "Path": "/api/health",
    "Interval": 10,
    "Timeout": 5,
    "HealthyThreshold": 2,
    "UnhealthyThreshold": 3
  }'

echo "AppRunner service created. Waiting for deployment..."
sleep 30

# Get service URL
SERVICE_URL=$(aws apprunner describe-service \
  --region $AWS_REGION \
  --service-arn arn:aws:apprunner:$AWS_REGION:$AWS_ACCOUNT_ID:service/cineview-app \
  --query 'Service.ServiceUrl' \
  --output text)

echo "✅ Service deployed at: https://$SERVICE_URL"
```

## Step 4: Configure Environment Variables

Add secrets to AppRunner via AWS Console:

1. Go to **AppRunner** → **Services** → **cineview-app**
2. Click **Configuration** tab
3. **Edit environment variables**
4. Add:

```
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/project
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_JWT_SECRET=your-jwt-secret
AI_ENGINE_URL=https://ai-engine-service-url
AWS_REGION=us-east-1
```

Or via CLI:

```bash
aws apprunner update-service \
  --region us-east-1 \
  --service-arn arn:aws:apprunner:us-east-1:ACCOUNT_ID:service/cineview-app \
  --instance-configuration '{
    "RuntimeEnvironmentVariables": {
      "NEXT_PUBLIC_SENTRY_DSN": "...",
      "NODE_ENV": "production"
    }
  }'
```

## Step 5: Deploy AI Engine (Separate Service)

Create another AppRunner service for AI Engine:

```bash
# Build AI Engine image
docker build -t cineview-ai-engine:latest ai-engine/

# Push to ECR
aws ecr create-repository --repository-name cineview-ai-engine 2>/dev/null || true

docker tag cineview-ai-engine:latest \
  $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cineview-ai-engine:latest

docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/cineview-ai-engine:latest

# Create AppRunner service for AI Engine
aws apprunner create-service \
  --service-name cineview-ai-engine \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "'$AWS_ACCOUNT_ID'.dkr.ecr.us-east-1.amazonaws.com/cineview-ai-engine:latest",
      "ImageRepositoryType": "ECR",
      "ImageConfiguration": {
        "Port": "8080"
      }
    }
  }' \
  --instance-configuration '{
    "InstanceRoleArn": "'$ROLE_ARN'",
    "Cpu": "2 vCPU",
    "Memory": "4 GB"
  }'
```

Get AI Engine URL and add to main app environment:

```bash
AI_ENGINE_URL=https://ai-engine-service-url-from-apprunner
```

## Step 6: Verify Deployment

```bash
# Get service URL
aws apprunner describe-service \
  --service-arn arn:aws:apprunner:us-east-1:ACCOUNT_ID:service/cineview-app \
  --query 'Service.ServiceUrl' \
  --output text

# Test health endpoint
curl https://your-service-url/api/health

# Expected response:
# {
#   "status": "healthy",
#   "checks": {
#     "database": { "status": "pass" },
#     "aiEngine": { "status": "pass" },
#     "storage": { "status": "pass" }
#   }
# }
```

## Step 7: Set Up Auto-Scaling

```bash
aws apprunner update-service \
  --service-arn arn:aws:apprunner:us-east-1:ACCOUNT_ID:service/cineview-app \
  --auto-scaling-configuration '{
    "MinSize": 1,
    "MaxSize": 4,
    "TargetCpuUtilization": 70
  }'
```

## Step 8: Enable Custom Domain (Optional)

```bash
# Add custom domain
aws apprunner associate-custom-domain \
  --service-arn arn:aws:apprunner:us-east-1:ACCOUNT_ID:service/cineview-app \
  --domain-name your-domain.com

# Verify DNS records in Route 53
# AppRunner provides CNAME to add to your DNS
```

## Monitoring & Logs

View logs in CloudWatch:

```bash
# Get log group
aws logs describe-log-groups --query 'logGroups[?contains(logGroupName, `cineview`)].logGroupName'

# Stream logs
aws logs tail /aws/apprunner/cineview-app --follow
```

## CI/CD Automation (GitHub Actions)

Create `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS AppRunner

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Push to ECR
        run: |
          aws ecr get-login-password --region us-east-1 | \
            docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
          
          docker build -t cineview-app:$GITHUB_SHA .
          docker tag cineview-app:$GITHUB_SHA \
            ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/cineview-app:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/cineview-app:latest
      
      - name: Update AppRunner service
        run: |
          aws apprunner start-deployment \
            --service-arn arn:aws:apprunner:us-east-1:${{ secrets.AWS_ACCOUNT_ID }}:service/cineview-app
```

## Troubleshooting

### Service won't start
```bash
# Check logs
aws logs tail /aws/apprunner/cineview-app --follow

# Common issues:
# - Port mismatch (should be 3000)
# - Missing environment variables
# - Docker image not found in ECR
```

### Health check failing
```bash
# Verify health endpoint locally
npm run dev
curl http://localhost:3000/api/health

# Add more detailed logging to health endpoint
# See app/api/health/route.ts
```

### Secrets not accessible
```bash
# Verify IAM role has permission
aws iam get-role-policy \
  --role-name cineview-apprunner-role \
  --policy-name cineview-secrets-policy

# Check secret exists
aws secretsmanager describe-secret \
  --secret-id cineview-supabase-service-role
```

## Summary

| Component | Status | URL |
|-----------|--------|-----|
| App | Deployed | `https://cineview-xxxx.us-east-1.awsapprunner.com` |
| AI Engine | Deployed | `https://ai-engine-xxxx.us-east-1.awsapprunner.com` |
| Database | Connected | Supabase |
| Monitoring | Active | Sentry |
| Secrets | Secured | AWS Secrets Manager |

Your app is now live on AWS with:
- ✅ Auto-scaling
- ✅ HTTPS enabled
- ✅ Health checks
- ✅ Integrated secrets management
- ✅ CloudWatch logs
- ✅ CI/CD ready

---

**Next:** Share your public URL! 🎉
