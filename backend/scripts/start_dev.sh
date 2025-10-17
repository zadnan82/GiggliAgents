#!/bin/bash

# Development startup script

echo "🚀 Starting GiggliAgents Backend (Development Mode)"
echo "=================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration"
    exit 1
fi

# Check if database is setup
echo "🔍 Checking database..."
python -c "from app.database import engine; engine.connect()" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "📊 Database not initialized. Running setup..."
    python setup.py
fi

# Start server
echo "🌐 Starting server on http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo "=================================================="
uvicorn app.main:app --reload --port 8000