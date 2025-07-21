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
    
    # Build ARG for selecting which app to build
    ARG APP
    ENV NODE_ENV=development
    ENV APP=${APP}
    
    # Copy entire monorepo for build context
    COPY . .
    
    # Build the selected app
    RUN pnpm run db:generate
    RUN pnpm run build:${APP}
    
    # -----------------------------
    # Production Stage
    # -----------------------------
    FROM base AS production
    
    ARG APP
    ENV NODE_ENV=production
    ENV APP=${APP}
    
    # Prune dev dependencies
    RUN pnpm install --prod
    
    COPY --from=development /usr/src/app/apps/${APP}/dist ./dist

    
    # Start the app
    CMD ["pnpm", "start:${APP}"]
    