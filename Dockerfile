# Use Node.js LTS
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variables must be present at build time
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js based on the preferred package manager
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Ensure public/uploads exists and is writable
RUN mkdir -p public/uploads
RUN chown nextjs:nodejs public/uploads

# Ensure SQLite db can be written to
RUN mkdir -p prisma
COPY --from=builder /app/prisma/schema.prisma ./prisma/
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db
RUN chown -R nextjs:nodejs prisma

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Setup SQLite Database URL pointing to the new location
ENV DATABASE_URL="file:/app/prisma/dev.db"

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
