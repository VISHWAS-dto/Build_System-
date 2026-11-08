# syntax=docker/dockerfile:1

# ---- base: Node + pnpm ----
FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# ---- deps: all dependencies (needed to build) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ---- build: generate Prisma client and compile TypeScript ----
FROM deps AS build
COPY . .
RUN pnpm exec prisma generate && pnpm run build

# ---- prod-deps: runtime dependencies only ----
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# ---- runtime: small final image ----
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
