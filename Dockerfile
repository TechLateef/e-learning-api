# Build stage
FROM node:20 AS build

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .  # Corrected from `COPY ..` to `COPY . .`

RUN yarn run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
