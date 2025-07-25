# -----------------------------
# Base stage: shared setup
# -----------------------------
    FROM node:20-alpine AS base

    # Install pnpm globally
    RUN npm install -g pnpm
    
    # Set workdir
    WORKDIR /usr/src/app
    
    # Copy workspace root files
    COPY . .
    
    # Install dependencies (non-pruned)
    RUN pnpm install
    
    # -----------------------------
    # Development Stage
    # -----------------------------
    FROM base AS development
    
    ENV NODE_ENV=development
    
    COPY . .
    
    # Build the selected app
    RUN pnpm run db:generate
    RUN pnpm run build:nestjs
    
    # -----------------------------
    # Production Stage
    # -----------------------------
    FROM base AS production
    
    ENV NODE_ENV=production
    
    # Prune dev dependencies
    RUN pnpm install --prod

    RUN pnpm run db:generate
    
    COPY --from=development /usr/src/app/apps/nestjs/dist ./dist

    COPY --from=development /usr/src/app/apps/nestjs/prisma ./prisma
    
    # Start the app
    CMD ["pnpm", "start:nestjs"]
    