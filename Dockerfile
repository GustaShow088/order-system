FROM node:22-alpine AS builder

WORKDIR /app

# Copia as dependências da raiz do monorepo
COPY package.json package-lock.json ./
RUN npm ci

# Copia todo o código
COPY . .

# Builda o gateway
RUN cd gateway && npx tsc

FROM node:22-alpine

WORKDIR /app

# Copia apenas o necessário para produção
COPY --from=builder /app/gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]