# Order System

![CI](https://github.com/GustaShow088/order-system/actions/workflows/ci.yml/badge.svg)

Sistema de pedidos em microsserviços com TypeScript, Node.js, PostgreSQL, Redis e Docker.

## Arquitetura

- **Gateway** (porta 3000): BFF que roteia requisições para os serviços internos
- **Order Service** (porta 3001): CRUD de usuários e pedidos com Prisma + PostgreSQL
- **Payment Service** (porta 3002): Consome fila Redis e processa pagamentos com idempotência

## Stack

| Tecnologia              | Uso                                     |
| ----------------------- | --------------------------------------- |
| TypeScript              | Tipagem estática em todos os serviços   |
| Node.js + Express       | APIs REST                               |
| Prisma                  | ORM com PostgreSQL                      |
| Redis + Bull            | Filas de mensagens entre microsserviços |
| Docker + Docker Compose | Containerização da infraestrutura       |
| Jest                    | Testes unitários                        |
| GitHub Actions          | CI/CD automatizado                      |

## Deploy

- **Gateway**: [https://order-system-gateway.onrender.com](https://order-system-gateway.onrender.com)

## Como rodar localmente

```bash
# Subir infraestrutura (PostgreSQL + Redis)
docker-compose up -d redis postgres

# Terminal 1: Gateway
npm run dev --workspace=gateway

# Terminal 2: Order Service
npm run dev --workspace=order-service

# Terminal 3: Payment Service
npm run dev --workspace=payment-service
```

## Testes

```bash
npm run test --workspace=order-service
```

## Endpoints

| Método | Endpoint                | Descrição                 |
| ------ | ----------------------- | ------------------------- |
| GET    | `/health`               | Health check do Gateway   |
| POST   | `/api/users`            | Criar usuário             |
| POST   | `/api/orders`           | Criar pedido com itens    |
| GET    | `/api/users/:id/orders` | Listar pedidos do usuário |

## Estrutura

```
order-system/
├── gateway/ # API Gateway (BFF)
│ ├── src/
│ └── Dockerfile
├── order-service/ # CRUD de pedidos + Prisma
│ ├── src/
│ ├── prisma/
│ └── tests/
├── payment-service/ # Worker de pagamentos + Redis
│ └── src/
├── docker-compose.yml # Infra completa
└── .github/workflows/ # CI/CD
```

## Decisões Técnicas

- **Microsserviços**: separação de responsabilidades entre Gateway, Pedidos e Pagamentos
- **Filas (Bull + Redis)**: desacopla o processamento de pagamentos do fluxo síncrono de criação de pedidos
- **Idempotência**: o Payment Service verifica no Redis se o pedido já foi processado antes de executar, evitando cobrança dupla
- **Índices no PostgreSQL**: otimização de queries frequentes (user_id, status, created_at)
