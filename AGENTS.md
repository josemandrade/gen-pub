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
├── backend/              # Spring Boot app
├── frontend/             # React + Vite app
├── .github/workflows/    # CI (GitHub Actions)
├── docker-compose.yml
├── docker-compose.prod.yml
├── Makefile
├── deploy.sh
├── .env.prod.example
└── docs/
```

## Prerequisites

- **Java 17+** con `JAVA_HOME` configurado
- **Node.js 18+** para frontend

## Test user

Al iniciar el backend con BD vacía, se crea automáticamente:
- **Email**: `admin@test.com`
- **Password**: `password123`

## Perfiles Spring

| Perfil | Uso | BD |
|--------|-----|----|
| `dev` (default) | Desarrollo local | PostgreSQL |
| `prod` | Producción | PostgreSQL (vía env vars) |
| `e2e` | Tests E2E | H2 en memoria |
| `test` | Tests unitarios | H2 en memoria |

## Tests

```bash
# Backend (unit tests)
make test-backend             # o: cd backend && ./mvnw test -B

# Backend (unit + integration tests)
make test-all                 # o: cd backend && ./mvnw verify -B

# Frontend (unit tests con Vitest)
cd frontend && npm test
cd frontend && npm run test:watch     # watch mode
cd frontend && npm run test:coverage  # con cobertura

# Frontend (linter)
cd frontend && npm run lint

# Frontend (typecheck)
cd frontend && npx tsc -b --noEmit

# E2E (Playwright)
cd frontend && npm run e2e            # headless
cd frontend && npm run e2e:ui         # con UI interactiva
```

## CI/CD

GitHub Actions en `.github/workflows/ci.yml` — se ejecuta en push/PR a `master`:

| Job | Qué hace |
|-----|----------|
| **Backend** | `./mvnw test -B` con PostgreSQL service container |
| **Frontend** | `npm run lint` → `tsc -b --noEmit` → `npm test` → `npm run build` |
| **E2E** | Levanta backend (Spring Boot perfil e2e) + frontend, corre Playwright headless |

## API Docs (OpenAPI)

- **JSON**: [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
- **UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Env files

- `.env.prod.example` — Variables para producción (DB, JWT, OpenAI)
- `backend/.env.example` — Variables para desarrollo local

## Commands

```bash
# Backend (requiere JAVA_HOME + PostgreSQL en localhost:5432)
cd backend && ./mvnw spring-boot:run

# Frontend (requiere Node 18+)
cd frontend && npm run dev

# Tests backend
cd backend && ./mvnw test -B

# Full stack (Docker, desarrollo)
make dev              # o: docker compose up --build

# Producción (VPS con Docker)
cp .env.prod.example .env.prod   # editar secrets
make prod                         # o: docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Deploy (git pull + rebuild)
make deploy           # o: ./deploy.sh

# Logs de producción
make logs

# Limpiar contenedores + volúmenes
make clean
```

## Conventions

- Commits en español o inglés, lo que prefiera el usuario
- Backend: arquitectura por feature (auth, campaign, ad), no por capas técnicas
- Frontend: pages/ → componentes de página, components/ → reutilizables, api/ → llamadas HTTP
- Migraciones Flyway con nombres descriptivos: `V1__create_users_table.sql`
- DTOs de entrada con `@Valid` + anotaciones Jakarta Validation
- Errores del backend en formato estándar `{ "status", "error", "message", "timestamp" }`
