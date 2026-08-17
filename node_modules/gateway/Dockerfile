FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN npm install express typescript tsx @types/node @types/express

COPY . .

EXPOSE 3000

CMD ["npx", "tsx", "watch", "src/server.ts"]