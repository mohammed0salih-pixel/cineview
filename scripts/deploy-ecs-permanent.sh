#!/bin/bash
set -e

AWS_REGION="us-east-1"
CLUSTER_NAME="cineview-cluster"
SERVICE_NAME="cineview-service"
TASK_FAMILY="cineview-task"
ECR_IMAGE="956651462373.dkr.ecr.us-east-1.amazonaws.com/cineview-app:latest"

VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --region "$AWS_REGION" --query 'Vpcs[0].VpcId' --output text)
SUBNETS=($(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --region "$AWS_REGION" --query 'Subnets[*].SubnetId' --output text))
SECURITY_GROUP=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=group-name,Values=default" --region "$AWS_REGION" --query 'SecurityGroups[0].GroupId' --output text)

aws ecs create-cluster --cluster-name "$CLUSTER_NAME" --region "$AWS_REGION" >/dev/null 2>&1 || true

LB_SG_ID=$(aws ec2 create-security-group --group-name "cineview-lb-sg" --description "Cineview ALB SG" --vpc-id "$VPC_ID" --region "$AWS_REGION" --query 'GroupId' --output text 2>/dev/null || aws ec2 describe-security-groups --filters "Name=group-name,Values=cineview-lb-sg" --region "$AWS_REGION" --query 'SecurityGroups[0].GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id "$LB_SG_ID" --protocol tcp --port 80 --cidr 0.0.0.0/0 --region "$AWS_REGION" 2>/dev/null || true

ALB_ARN=$(aws elbv2 create-load-balancer --name cineview-alb --subnets ${SUBNETS[0]} ${SUBNETS[1]} --security-groups "$LB_SG_ID" --region "$AWS_REGION" --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>/dev/null || aws elbv2 describe-load-balancers --names cineview-alb --region "$AWS_REGION" --query 'LoadBalancers[0].LoadBalancerArn' --output text)
ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns "$ALB_ARN" --region "$AWS_REGION" --query 'LoadBalancers[0].DNSName' --output text)

TG_ARN=$(aws elbv2 create-target-group --name cineview-tg --protocol HTTP --port 3000 --vpc-id "$VPC_ID" --health-check-path "/api/health" --region "$AWS_REGION" --query 'TargetGroups[0].TargetGroupArn' --output text 2>/dev/null || aws elbv2 describe-target-groups --names cineview-tg --region "$AWS_REGION" --query 'TargetGroups[0].TargetGroupArn' --output text)

aws elbv2 create-listener --load-balancer-arn "$ALB_ARN" --protocol HTTP --port 80 --default-actions "Type=forward,TargetGroupArn=$TG_ARN" --region "$AWS_REGION" 2>/dev/null || true

ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text 2>/dev/null || aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}' --query 'Role.Arn' --output text)
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy 2>/dev/null || true

cat > /tmp/cineview-task.json << EOF
{
  "family": "${TASK_FAMILY}",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "${ROLE_ARN}",
  "containerDefinitions": [
    {
      "name": "cineview-app",
      "image": "${ECR_IMAGE}",
      "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
      "environment": [
        {"name": "NEXT_PUBLIC_SUPABASE_URL", "value": "https://kkaogyykfqhkswzccxiq.supabase.co"},
        {"name": "NEXT_PUBLIC_SUPABASE_ANON_KEY", "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrYW9neXlrZnFoa3N3emNjeGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTI4MjAsImV4cCI6MjA4NTY4ODgyMH0.n6IClQaT0S6gviwcurIg7e_G4O0dc--d3IiVwWmEQV8"},
        {"name": "AI_ENGINE_URL", "value": ""}
      ],
      "essential": true
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file:///tmp/cineview-task.json --region "$AWS_REGION" >/dev/null

aws ecs create-service --cluster "$CLUSTER_NAME" --service-name "$SERVICE_NAME" --task-definition "$TASK_FAMILY" --desired-count 1 --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[${SUBNETS[0]},${SUBNETS[1]}],securityGroups=[$SECURITY_GROUP],assignPublicIp=ENABLED}" --load-balancers "targetGroupArn=$TG_ARN,containerName=cineview-app,containerPort=3000" --region "$AWS_REGION" >/dev/null 2>&1 || aws ecs update-service --cluster "$CLUSTER_NAME" --service "$SERVICE_NAME" --task-definition "$TASK_FAMILY" --region "$AWS_REGION" >/dev/null

echo "✅ Permanent URL (ALB): http://${ALB_DNS}"
