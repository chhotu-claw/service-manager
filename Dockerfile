FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN cd client && npx vite build

FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server/ ./server/
COPY config.json services.yaml ./
COPY --from=builder /app/client/dist ./client/dist/

EXPOSE 9091
CMD ["node", "server/index.js"]
