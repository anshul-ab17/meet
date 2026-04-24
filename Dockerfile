# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS base
RUN npm install -g pnpm@9.0.0

# Install all workspace dependencies 
FROM base AS installer
WORKDIR /app

# Copy manifests only (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json                    ./apps/server/
COPY packages/db/package.json                    ./packages/db/
COPY packages/shared/package.json               ./packages/shared/
COPY packages/eslint-config/package.json        ./packages/eslint-config/
COPY packages/typescript-config/package.json    ./packages/typescript-config/

RUN pnpm install --frozen-lockfile

# Build all packages the server depends on 
FROM base AS builder
WORKDIR /app

COPY --from=installer /app/node_modules          ./node_modules
COPY --from=installer /app/apps/server/node_modules  ./apps/server/node_modules
COPY --from=installer /app/packages/db/node_modules  ./packages/db/node_modules
COPY . .

RUN pnpm --filter @repo/shared build
RUN pnpm --filter @repo/db build
RUN pnpm --filter server build

# Create standalone deployment (resolves workspace deps) 
FROM base AS deployer
WORKDIR /app

COPY --from=builder /app .
RUN pnpm --filter server deploy --prod /standalone

# Final production image 
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deployer /standalone .

EXPOSE 3003

CMD ["node", "dist/index.js"]
