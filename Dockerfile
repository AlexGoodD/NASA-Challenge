# Build and run the AdonisJS app
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Install dependencies (including dev) for building
FROM base AS deps
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

# Compile the TypeScript application
FROM base AS build
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Prune dev dependencies
FROM deps AS prod-deps
RUN npm prune --omit=dev

# Runtime image
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3333
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

# Use a non-root user for security
RUN useradd --user-group --system --create-home adonis
USER adonis

EXPOSE 3333
CMD ["node", "build/bin/server.js"]
