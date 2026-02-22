# ==========================
# Stage 1: Base image
# ==========================
FROM node:20-alpine AS base
WORKDIR /app

# Install required system libraries and pnpm globally
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm@latest

# ==========================
# Stage 2: Dependencies
# ==========================
FROM base AS deps
WORKDIR /app

# Copy only package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# ==========================
# Stage 3: Builder
# ==========================
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source code
COPY . .

# Build NestJS application
RUN pnpm run build

# ==========================
# Stage 4: Production Runner
# ==========================
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3001

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

# Copy built app and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Use non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main.js"]