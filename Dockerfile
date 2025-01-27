# Build stage
FROM node:20 AS build

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files and install dependencies
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the entire app and build
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install pnpm globally for the production stage
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the necessary files
COPY package*.json pnpm-lock.yaml ./

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Set the default command to run the app
CMD ["node", "dist/index.js"]
