# ---------- Build Stage ----------
FROM node:24.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ---------- Production Stage ----------
FROM node:24.14.0-alpine AS runner

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist .

EXPOSE 3000

CMD ["node", "server.js"]