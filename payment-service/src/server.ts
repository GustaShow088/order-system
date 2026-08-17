import express from 'express';
import { startConsumer } from './consumer';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Payment service running on http://localhost:${PORT}`);
});

// Inicia o consumidor da fila junto com o servidor
startConsumer().catch((error) => {
  console.error('Consumer crashed:', error);
  process.exit(1);
});