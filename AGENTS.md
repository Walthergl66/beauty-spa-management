# AGENTS.md — SPA Titulación

Monorepo sin workspace root: `backend/` (NestJS 12 API real) + `frontend/` (React 18 + Vite 6, estático con mock data, aún sin conexión al backend). Sin scripts en la raíz; corre cada comando desde su carpeta.

## Backend (`backend/`) — fuente de verdad

- Setup: `cp .env.example .env` (obligatorio: boot falla por validación `src/config/env.validation.ts` sin `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`), `docker compose up -d postgres`, `npm install`, `npm run start:dev` → `http://localhost:3000/api/v1`, Swagger en `/api/docs`.
- DB: Postgres 16 + `btree_gist` (init en `docker/init-db.sql`). Host difiere: fuera de compose `DB_HOST=localhost` (puerto host `DB_PORT=5435` en ejemplo), dentro del servicio `api` es `DB_HOST=postgres:5432` (ya fijado en `docker-compose.yml`). Datos en volumen `spa_postgres_data`.
- Comandos: `npm test` (Vitest unitarios `**/*.spec.ts`), `npm run test:e2e` (`**/*.e2e-spec.ts`; `flows` requiere Postgres, `health` no; sin DB se omite solo con warning), `npm run lint` (`oxlint --type-aware src/ test/`), `npm run build` / `npm run start:prod` (`node dist/main`), `npm run seed` (hace `nest build` y corre `dist/database/seeds/sus-seed.js`, idempotente). Frontend solo tiene `dev|build|preview`.
- ESM NodeNext (`tsconfig` `module/moduleResolution: nodenext`): imports internos SIEMPRE con extensión `.js` (ej. `from './app.module.js'` en un `.ts`). Prettier: singleQuote + trailingComma all.
- Convenciones globales (`src/main.ts`): prefijo `api/v1`, `ValidationPipe{whitelist, forbidNonWhitelisted, transform}`, respuesta estándar `{ success, data, timestamp }` vía `TransformInterceptor`, `AllExceptionsFilter`, helmet con CSP off (para Swagger), CORS por `CORS_ORIGIN`, throttle 100 req/min global.
- Invariantes de dominio (no romper): fechas en UTC (`SPA_TIMEZONE=America/Guayaquil` solo display); anti doble-reserva doble: `AvailabilityService.isSlotAvailable` + exclusión GiST `no_overlapping_appointments` (`tstzrange &&`, excluye canceladas); asistente (`/assistant/chat`, `LLM_PROVIDER=mock|openai|gemini`, default `mock`) solo llama servicios del backend, jamás SQL directo; cancelar/reprogramar con margen 2h; un anticipo activo por cita (`payments`).

## Frontend (`frontend/`)

- `npm run dev` → `:5173`; `vite.config.js` proxea `/api` → `localhost:3000`. PWA (`vite-plugin-pwa`). Sin lint/test/typecheck. No cablear aún llamadas reales sin coordinar forma del envelope `{ success, data }`.

## Notas de repo

- `doc/` está en `.gitignore` raíz (el `plan-backend-nestjs.md` rector puede no existir en clones frescos); `agent.md` es tracker local de sprints, no commitearlo.
- Módulos backend en `src/modules/`: `auth|users|services|employees|availability|appointments|notifications|assistant|dashboard|payments`. Entradas: `src/main.ts`, `src/app.module.ts`.
