.PHONY: dev prod deploy logs clean

dev:
	docker compose up --build

dev-down:
	docker compose down

prod:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d

prod-down:
	docker compose -f docker-compose.prod.yml down

deploy:
	./deploy.sh

logs:
	docker compose -f docker-compose.prod.yml logs -f

clean:
	docker compose down -v
	docker system prune -f

test-backend:
	cd backend && ./mvnw test -B

test-all:
	cd backend && ./mvnw verify -B
