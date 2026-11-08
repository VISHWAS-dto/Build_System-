#!/usr/bin/env bash
# One-shot local setup: env file, dependencies (docker), migrations, seed.
# Usage: pnpm run setup:local
set -euo pipefail

cd "$(dirname "$0")/../.."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

docker compose up -d

echo "Waiting for Postgres..."
until docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; do
  sleep 1
done

# "deploy" applies committed migrations without interactive prompts.
# To create a new migration after a schema change, run: pnpm run prisma:migrate -- --name <name>
pnpm exec prisma migrate deploy
pnpm run prisma:seed

echo "Local setup done. Start the app with: pnpm run dev"
