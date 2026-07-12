# AGENTS.md

## Stack

- **Backend**: Java 17, Spring Boot 3, Maven, PostgreSQL, Flyway, Spring Security + JWT
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Hook Form + Zod
- **Infrastructure**: Docker, perfiles Spring (dev/prod), cloud-ready
- **IA**: Integración con OpenAI para generación de copy y sugerencias de imágenes
- **Storage**: Local filesystem (con interfaz intercambiable a S3 en el futuro)

## Structure

```
generador-publicidad/
├── backend/       # Spring Boot app
├── frontend/      # React + Vite app
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── deploy.sh
└── docs/
```

## Prerequisites

- **Java 17+** con `JAVA_HOME` configurado
- **Node.js 18+** para frontend

## Test user

Al iniciar el backend con BD vacía, se crea automáticamente:
- **Email**: `admin@test.com`
- **Password**: `password123`

## Commands

```bash
# Backend (requiere JAVA_HOME + PostgreSQL en localhost:5432)
cd backend && ./mvnw spring-boot:run

# Frontend (requiere Node 18+)
cd frontend && npm run dev

# Tests backend
cd backend && ./mvnw test -B

# Full stack (Docker, desarrollo)
docker compose up --build

# Producción (VPS con Docker)
cp .env.prod.example .env.prod   # editar secrets
make prod                         # o: docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Deploy (git pull + rebuild)
./deploy.sh
```

## Conventions

- Commits en español o inglés, lo que prefiera el usuario
- Backend: arquitectura por feature (auth, campaign, ad), no por capas técnicas
- Frontend: pages/ → componentes de página, components/ → reutilizables, api/ → llamadas HTTP
- Migraciones Flyway con nombres descriptivos: `V1__create_users_table.sql`
- DTOs de entrada con `@Valid` + anotaciones Jakarta Validation
- Errores del backend en formato estándar `{ "status", "error", "message", "timestamp" }`
