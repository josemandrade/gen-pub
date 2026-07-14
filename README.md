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

## Tests

### Backend (unitarios e integración)

```bash
cd backend
./mvnw test -B
```

Usa H2 en memoria (perfil `test`), no requiere PostgreSQL. Incluye tests de:
- `AuthServiceTest` — login, registro, email duplicado
- `AdServiceTest` — CRUD de anuncios, subida de archivos, generación de copy, eliminación
- `JwtProviderTest` — generación y validación de tokens
- `GlobalExceptionHandlerTest` — manejo de errores HTTP

> **Windows**: Usá `mvnw.cmd` en vez de `./mvnw`.

### Frontend (unitarios)

Pruebas unitarias con Vitest + React Testing Library para componentes,
hooks, store y utilidades:

```bash
cd frontend
npm install            # requiere vitest + testing-library como devDeps
npm test               # una ejecución
npm run test:watch     # modo watch (desarrollo)
npm run test:coverage  # con reporte de cobertura
```

Incluye tests de:
- **Utils**: `cn()` (filtrado de clases, resolución de conflictos Tailwind)
- **Store**: `authStore` Zustand (login, logout, persistencia, verificación de token)
- **Componentes UI**: `Button` (variantes, tamaños, loading, disabled), `Input` (label, error, forwardRef), `Card` / `CardHeader` / `CardContent`

### E2E (Playwright)

Pruebas end-to-end que validan frontend + backend juntos. Playwright arranca
automáticamente el backend (perfil `e2e` con H2) y el frontend (Vite), ejecuta
los tests y detiene ambos servicios al finalizar.

```bash
cd frontend
npm install
npx playwright install chromium
npm run e2e
```

Para ver el navegador en acción (modo headed):
```bash
npm run e2e -- --headed
```

Para ralentizar las acciones y observar cada paso:
```bash
# Linux/macOS
SLOW_MO=500 npm run e2e -- --headed

# Windows (PowerShell)
$env:SLOW_MO=500; npm run e2e -- --headed
```

Con interfaz gráfica Playwright UI:
```bash
npm run e2e:ui
```

#### Notas sobre plataformas

- **Linux / WSL2**: El webServer arranca Vite como proceso de Windows (a través
  de `/init`). Playwright usa `url` en vez de `port` para esperar a que Vite
  esté listo, verificando que `http://localhost:5173/` responda HTTP 200.
- **Windows nativo**: Funciona directamente con `localhost`.
- **CI (GitHub Actions)**: Usa PostgreSQL en contenedor en vez de H2. Ver
  sección CI/CD.

Los tests cubren:
- **Autenticación**: login exitoso, setup con `storageState` (login único para
  toda la suite)
- **Campañas**: crear campaña, listar campañas
- **Anuncios**: historial vacío, wizard de creación con selector de campaña

### CI/CD

En GitHub Actions se ejecutan 3 jobs en paralelo:

| Job | Comandos | Requisitos |
|-----|----------|-----------|
| Backend | `./mvnw test -B` | PostgreSQL en puerto 5433 |
| Frontend | `npm run lint && npx tsc && npm test && npm run build` | Node 22 |
| E2E | `npm run e2e` | PostgreSQL + JDK 17 + Node 22 |

Los tests E2E en CI usan PostgreSQL (container Docker) en vez de H2.

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
