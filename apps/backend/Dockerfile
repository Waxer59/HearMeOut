FROM node:20-alpine3.19 as base

# Install pnpm globally
RUN apk add --no-cache libc6-compat && \
    npm install -g pnpm

FROM base AS prune
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Check https://turbo.build/repo/docs/reference/command-line-reference/prune
RUN turbo prune backend --docker

FROM base AS builder

# First install the dependencies (as they change less often)
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
COPY --from=prune /app/out/full/ .
COPY --from=prune /app/out/json/ .
COPY --from=prune /app/out/pnpm-lock.yaml /app/out/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build the project
RUN pnpm build --filter=backend

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/apps/backend/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./dist

CMD pnpm start:prod