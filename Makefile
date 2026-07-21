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

# Kubernetes / Helm
k8s-dev:
	$(MAKE) -C k8s dev

k8s-prod:
	$(MAKE) -C k8s prod

k8s-build:
	$(MAKE) -C k8s build-images

k8s-load:
	$(MAKE) -C k8s load-images

k8s-delete:
	$(MAKE) -C k8s delete

k8s-logs:
	$(MAKE) -C k8s logs

k8s-status:
	$(MAKE) -C k8s status

k8s-deploy:
	./k8s/deploy-k8s.sh ${ARGS}
