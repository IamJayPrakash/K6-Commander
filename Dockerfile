# Dockerfile for K6 Commander

# 1. Install dependencies
FROM node:20-alpine AS deps
# The --no-cache flag ensures that the package index is updated and packages are installed in a single layer.
# libc6-compat is needed for Next.js on Alpine.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Use `npm ci` for faster, more reliable builds in CI/CD environments
RUN npm ci

# 2. Get Docker CLI
# We need the Docker CLI to spawn k6 containers from our Next.js backend.
FROM docker:25.0-cli as docker-cli

# 3. Build the Next.js application
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables can be passed at build time
# For example, to inject a build ID or other metadata.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# 4. Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# If you have a group and user for security purposes
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy Docker CLI from the separate stage
COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker

# Expose the port the app runs on
EXPOSE 3000

# The command to start the app
CMD ["npm", "start"]
