#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

ENV_FILE="${1:-.env.prod}"
COMPOSE_FILE="docker-compose.prod.yml"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: no se encuentra $ENV_FILE"
    echo "Copia .env.prod.example a $ENV_FILE y completa las variables"
    exit 1
fi

echo "=== Pulling latest code ==="
git pull

echo "=== Building & restarting ==="
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up --build -d

echo "=== Limpiando imágenes viejas ==="
docker image prune -f

echo "=== Estado ==="
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps

echo ""
echo "Listo. Logs: docker compose -f $COMPOSE_FILE logs -f"
