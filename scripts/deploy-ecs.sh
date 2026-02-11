#!/bin/bash
set -e

echo "🚀 AWS ECS Deployment"
echo "===================="

# Config
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="956651462373"
ECR_REPO="cineview-app"
CLUSTER_NAME="cineview-cluster"
SERVICE_NAME="cineview-service"
TASK_FAMILY="cineview-task"

# Step 1: Verify AWS credentials
echo ""
echo "Step 1: Verifying AWS credentials..."
if ! aws sts get-caller-identity &>/dev/null; then
  echo "❌ AWS not configured"
  exit 1
fi
echo "✅ AWS configured"

# Step 2: Create ECS cluster if it doesn't exist
echo ""
echo "Step 2: Creating ECS cluster..."
aws ecs create-cluster \
  --cluster-name "$CLUSTER_NAME" \
  --region "$AWS_REGION" 2>/dev/null || echo "ℹ️  Cluster already exists"

# Step 3: Get VPC and Subnet info (use default VPC)
echo ""
echo "Step 3: Getting network configuration..."
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --region "$AWS_REGION" --query 'Vpcs[0].VpcId' --output text)
SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --region "$AWS_REGION" --query 'Subnets[0].SubnetId' --output text)
SECURITY_GROUP=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=group-name,Values=default" --region "$AWS_REGION" --query 'SecurityGroups[0].GroupId' --output text)

echo "✅ VPC: $VPC_ID"
echo "✅ Subnet: $SUBNET_ID"
echo "✅ Security Group: $SECURITY_GROUP"

# Step 4: Create security group for load balancer (allow HTTP/HTTPS)
echo ""
echo "Step 4: Creating load balancer security group..."
LB_SG_ID=$(aws ec2 create-security-group \
  --group-name "cineview-lb-sg" \
  --description "Security group for Cineview load balancer" \
  --vpc-id "$VPC_ID" \
  --region "$AWS_REGION" \
  --query 'GroupId' \
  --output text 2>/dev/null || aws ec2 describe-security-groups --filters "Name=group-name,Values=cineview-lb-sg" --region "$AWS_REGION" --query 'SecurityGroups[0].GroupId' --output text)

# Allow HTTP and HTTPS
aws ec2 authorize-security-group-ingress \
  --group-id "$LB_SG_ID" \
  --protocol tcp --port 80 --cidr 0.0.0.0/0 \
  --region "$AWS_REGION" 2>/dev/null || true

aws ec2 authorize-security-group-ingress \
  --group-id "$LB_SG_ID" \
  --protocol tcp --port 443 --cidr 0.0.0.0/0 \
  --region "$AWS_REGION" 2>/dev/null || true

echo "✅ Load balancer security group: $LB_SG_ID"

# Step 5: Create load balancer
echo ""
echo "Step 5: Creating Application Load Balancer..."
LB_ARN=$(aws elbv2 create-load-balancer \
  --name "cineview-alb" \
  --subnets $SUBNET_ID \
  --security-groups "$LB_SG_ID" \
  --region "$AWS_REGION" \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text 2>/dev/null || aws elbv2 describe-load-balancers --names "cineview-alb" --region "$AWS_REGION" --query 'LoadBalancers[0].LoadBalancerArn' --output text)

LB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns "$LB_ARN" --region "$AWS_REGION" --query 'LoadBalancers[0].DNSName' --output text)
echo "✅ Load Balancer: $LB_DNS"

# Step 6: Create target group
echo ""
echo "Step 6: Creating target group..."
TG_ARN=$(aws elbv2 create-target-group \
  --name "cineview-tg" \
  --protocol HTTP \
  --port 3000 \
  --vpc-id "$VPC_ID" \
  --health-check-path "/api/health" \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region "$AWS_REGION" \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text 2>/dev/null || aws elbv2 describe-target-groups --names "cineview-tg" --region "$AWS_REGION" --query 'TargetGroups[0].TargetGroupArn' --output text)

echo "✅ Target Group: $TG_ARN"

# Step 7: Create listener for load balancer
echo ""
echo "Step 7: Creating load balancer listener..."
aws elbv2 create-listener \
  --load-balancer-arn "$LB_ARN" \
  --protocol HTTP \
  --port 80 \
  --default-actions "Type=forward,TargetGroupArn=$TG_ARN" \
  --region "$AWS_REGION" 2>/dev/null || echo "ℹ️  Listener already exists"

# Step 8: Create IAM role for ECS task execution
echo ""
echo "Step 8: Creating IAM roles..."
ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text 2>/dev/null || \
  aws iam create-role \
    --role-name ecsTaskExecutionRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Principal": {
            "Service": "ecs-tasks.amazonaws.com"
          },
          "Action": "sts:AssumeRole"
        }
      ]
    }' \
    --query 'Role.Arn' \
    --output text)

# Attach execution role policy
aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true

echo "✅ IAM Role: $ROLE_ARN"

# Step 9: Create task definition
echo ""
echo "Step 9: Creating ECS task definition..."
TASK_DEF=$(cat <<EOF
{
  "family": "$TASK_FAMILY",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "cineview-app",
      "image": "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "hostPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NEXT_PUBLIC_SUPABASE_URL",
          "value": "https://kkaogyykfqhkswzccxiq.supabase.co"
        },
        {
          "name": "AI_ENGINE_URL",
          "value": "http://localhost:8080"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/cineview",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "essential": true
    }
  ],
  "executionRoleArn": "$ROLE_ARN"
}
EOF
)

echo "$TASK_DEF" | aws ecs register-task-definition \
  --cli-input-json file:///dev/stdin \
  --region "$AWS_REGION" >/dev/null 2>&1 || echo "ℹ️  Task definition already exists or updated"

echo "✅ Task definition: $TASK_FAMILY"

# Step 10: Create ECS service
echo ""
echo "Step 10: Creating ECS service..."
aws ecs create-service \
  --cluster "$CLUSTER_NAME" \
  --service-name "$SERVICE_NAME" \
  --task-definition "$TASK_FAMILY" \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_ID],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$TG_ARN,containerName=cineview-app,containerPort=3000" \
  --region "$AWS_REGION" 2>/dev/null || echo "ℹ️  Service already exists"

echo "✅ ECS Service created: $SERVICE_NAME"

# Step 11: Wait for service to stabilize
echo ""
echo "Step 11: Waiting for service to stabilize (this takes 2-3 minutes)..."
echo "⏳ Deploying tasks..."
sleep 30

# Step 12: Get the load balancer DNS
echo ""
echo "Step 12: Getting public URL..."
echo ""
echo "✅ 🎉 YOUR PUBLIC URL:"
echo ""
echo "   http://$LB_DNS"
echo ""
echo "📝 Save this URL! Your app will be available at this address."
echo ""
echo "⏳ Note: Service is still warming up. Try accessing it in 1-2 minutes."
echo ""
echo "📊 Monitor your deployment:"
echo "   https://console.aws.amazon.com/ecs/v2/clusters/$CLUSTER_NAME/services/$SERVICE_NAME?region=$AWS_REGION"
