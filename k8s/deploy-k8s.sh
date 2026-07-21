#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

K8S_DIR="k8s"
HELM_DIR="${K8S_DIR}/helm/generador-publicidad"
RELEASE_NAME="generador-publicidad"
NAMESPACE="generador-publicidad"
PROFILE="${1:-dev}"

if [ "$PROFILE" != "dev" ] && [ "$PROFILE" != "prod" ]; then
    echo "Uso: $0 [dev|prod]"
    exit 1
fi

echo "=== Pulling latest code ==="
git pull

echo "=== Building images ==="
docker compose build backend frontend

if command -v minikube &> /dev/null && minikube status &> /dev/null; then
    echo "=== Loading images into Minikube ==="
    minikube image load generador-publicidad-backend:latest --overwrite=true
    minikube image load generador-publicidad-frontend:latest --overwrite=true
    CLUSTER_IP=$(minikube ip)
else
    echo "=== Minikube no detectado — confiando en registry externo ==="
    CLUSTER_IP="192.168.49.2"
fi

echo "=== Deploying with Helm (${PROFILE}) ==="
helm upgrade --install "$RELEASE_NAME" "$HELM_DIR" \
    --namespace "$NAMESPACE" \
    --create-namespace \
    --values "${HELM_DIR}/values-${PROFILE}.yaml" \
    --set clusterIP="$CLUSTER_IP" \
    --wait \
    --timeout 5m

echo ""
echo "=== Estado ==="
kubectl get pods --namespace "$NAMESPACE"

echo ""
APP_HOST="app.${CLUSTER_IP}.nip.io"
API_HOST="api.${CLUSTER_IP}.nip.io"
echo "Frontend: http://${APP_HOST}"
echo "Backend:  http://${API_HOST}"
echo "Logs:     stern ${RELEASE_NAME} --namespace ${NAMESPACE}"
