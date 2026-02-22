# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
# Install basic required libraries
RUN apk add --no-cache libc6-compat

# Install pnpm globally
RUN npm install -g pnpm@latest

WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile to ensure consistency
RUN pnpm install --frozen-lockfile

# Stage 3: Build application
FROM base AS builder
WORKDIR /app

# Copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source code
COPY . .

# Build the NestJS application
RUN pnpm run build

# Stage 4: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy build and dependencies from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Start the app
CMD ["node", "dist/main.js"]