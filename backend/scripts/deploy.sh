#!/bin/bash

# Production deployment script

echo "🚀 Deploying GiggliAgents Backend to Production"
echo "=============================================="

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t giggliagents-backend:latest .

# Tag for registry (replace with your registry)
docker tag giggliagents-backend:latest registry.example.com/giggliagents-backend:latest

# Push to registry
echo "📤 Pushing to registry..."
docker push registry.example.com/giggliagents-backend:latest

# Deploy (example with Docker Compose)
echo "🚢 Deploying..."
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec api alembic upgrade head

echo "✅ Deployment complete!"
echo "🌐 Backend: https://api.giggliagents.com"