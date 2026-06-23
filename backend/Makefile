.PHONY: help run build test docker-up docker-down migrate clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

run: ## Run the application
	go run main.go

build: ## Build the application
	go build -o bin/server main.go

test: ## Run tests
	go test -v ./...

docker-up: ## Start docker containers
	docker-compose up -d

docker-down: ## Stop docker containers
	docker-compose down

docker-logs: ## Show docker logs
	docker-compose logs -f

migrate: ## Run database migrations
	go run main.go migrate

clean: ## Clean build files
	rm -rf bin/

install: ## Install dependencies
	go mod download

dev: docker-up ## Start development environment
	@echo "Waiting for database..."
	@sleep 3
	@make run

.DEFAULT_GOAL := help
