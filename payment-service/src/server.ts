import express from 'express';
import './workers/payment.worker';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Payment service running on http://localhost:${PORT}`);
});