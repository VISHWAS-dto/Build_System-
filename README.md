# Book_Show

Backend for a BookMyShow-like application. Early stage: cities, cinemas, movies and shows APIs.

## Stack

Node.js, Fastify 5, TypeScript 5, Prisma 7 (PostgreSQL), Zod, Redis (cache, rate limit), Elasticsearch (movie search), pnpm, oxlint, Vitest.

## Structure

| Path | Purpose |
|---|---|
| `src/bootstrap/` | App initialization, one file per concern (config, logger, security, database, ...) |
| `src/infra/` | Clients and wrappers for external systems (Prisma, Redis, Elasticsearch) |
| `src/common/` | Shared errors, schemas, utils |
| `src/modules/<feature>/` | Feature code: routes, controller, service, repository, `dto/`, types |
| `prisma/` | Schema and migrations |
| `seeds/` | Seed scripts: `reference/` (all envs), `sample/` (dev only), `data/` (JSON) |
| `scripts/` | Operational scripts (db reset, search reindex, local setup) |
| `test/` | Unit and integration tests |
| `docker/` | Extra Docker configs (Postgres, Elasticsearch) |
| `Dockerfile`, `.dockerignore`, `docker-compose.yml` | Container image and local dependencies |
| `AGENTS.md` | Shared rules for all AI tools |

## Getting started

1. Start Docker, then run `pnpm install`.
2. Run `pnpm run setup:local` (creates `.env`, starts Postgres/Redis/Elasticsearch, migrates, seeds).
3. Run `pnpm run dev`. API: `http://localhost:3000/api/v1`, docs: `http://localhost:3000/docs`.
4. Optional: `pnpm run search:reindex` to index movies in Elasticsearch.

Redis and Elasticsearch are optional: set `REDIS_ENABLED=false` / `ELASTICSEARCH_ENABLED=false` in `.env` to run without them.

## Scripts

`pnpm run` + `dev`, `build`, `start`, `typecheck`, `lint`, `test`, `prisma:migrate`, `prisma:seed`, `db:reset -- --yes`, `search:reindex`, `setup:local`.

## Docker image

`docker build -t book-show .` builds a multi-stage production image (runs as non-root, port 3000).
# Build_System-
