import express from 'express';
import { randomUUID } from 'crypto';
import { prisma } from './prisma';
import { publishOrderCreated } from './queue';

const app = express();
app.use(express.json());

// Criar usuário
app.post('/users', async (req, res) => {
  const user = await prisma.user.create({
    data: req.body,
  });
  res.json(user);
});

// Criar pedido com itens + publicar evento na fila
app.post('/orders', async (req, res) => {
  const { userId, items, total } = req.body;

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: items,
      },
    },
    include: {
      items: true,
      user: true,
    },
  });

  // Publica o evento para o payment-service processar
  await publishOrderCreated({
    eventId: randomUUID(),
    orderId: order.id,
    userId: order.userId,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
  });

  res.status(201).json(order);
});

// Listar pedidos de um usuário
app.get('/users/:id/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.params.id },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Order service running on http://localhost:${PORT}`);
});