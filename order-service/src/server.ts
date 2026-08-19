import express from 'express';
import { prisma } from './prisma';
import { publishOrderCreated } from './queues/order.queue';

const app = express();
app.use(express.json());

// Criar usuário
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Criar pedido com itens
app.post('/orders', async (req, res) => {
  const { userId, items, total } = req.body;

  try {
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

    await publishOrderCreated(order.id, userId);
    console.log(`Evento order.created publicado para o pedido ${order.id}`);

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
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