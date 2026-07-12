# Generador de Publicidad

Aplicación web para crear y gestionar anuncios publicitarios con asistencia de IA.

## Stack

- **Backend**: Java 17, Spring Boot 3, Maven, PostgreSQL, Flyway, Spring Security + JWT
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Hook Form + Zod
- **IA**: OpenAI (generación de copy y sugerencias de imágenes)
- **Infra**: Docker, perfiles Spring (dev/prod)

## Requisitos

- Java 17+ con `JAVA_HOME` configurado
- Node.js 18+
- Docker y Docker Compose (opcional, para desarrollo con Docker)

## Desarrollo

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Requiere PostgreSQL en `localhost:5432`, base de datos `generador_publicidad`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en `http://localhost:5173` y proxea `/api` al backend.

### Tests

```bash
cd backend && ./mvnw test -B
```

Usa H2 en memoria, no requiere PostgreSQL.

### Full stack con Docker

```bash
docker compose up --build
```

Levanta PostgreSQL, backend y frontend.

## Producción

### Configurar

```bash
cp .env.prod.example .env.prod
# Editar secrets: POSTGRES_PASSWORD, JWT_SECRET, OPENAI_API_KEY
```

### Desplegar

```bash
make prod
# o: docker compose -f docker-compose.prod.yml --env-file .env.prod up -d
```

### Actualizar

```bash
./deploy.sh
```

### Comandos útiles

```bash
make dev       # desarrollo con Docker
make prod      # producción
make logs      # ver logs en producción
make deploy    # git pull + rebuild + restart
make test-all  # tests backend
```

## Usuario de prueba

Al iniciar con BD vacía se crea automáticamente:

- **Email**: `admin@test.com`
- **Password**: `password123`

## Estructura

```
backend/          # Spring Boot API
frontend/         # React + Vite SPA
docker-compose.yml        # Desarrollo
docker-compose.prod.yml   # Producción
Makefile                  # Atajos
deploy.sh                 # Script de deploy
```

## API

Con el backend corriendo, la documentación Swagger está en:

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`
