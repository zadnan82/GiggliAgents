.PHONY: help install setup dev test clean docker

help:
	@echo "GiggliAgents Backend - Available Commands"
	@echo "========================================"
	@echo "make install   - Install dependencies"
	@echo "make setup     - Setup database"
	@echo "make dev       - Start development server"
	@echo "make test      - Run tests"
	@echo "make clean     - Clean cache files"
	@echo "make docker    - Build Docker image"
	@echo "make deploy    - Deploy to production"

install:
	pip install -r requirements.txt

setup:
	python setup.py

dev:
	uvicorn app.main:app --reload --port 8000

test:
	pytest tests/ -v

clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete

docker:
	docker build -t giggliagents-backend .

deploy:
	bash scripts/deploy.sh