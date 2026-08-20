import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy para o Order Service
app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  })
);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gateway', timestamp: new Date().toISOString() });
});

// Raiz — informações do serviço
app.get('/', (_req, res) => {
  res.json({
    service: 'order-system-gateway',
    status: 'running',
    endpoints: ['/health', '/api/users', '/api/orders'],
    docs: 'https://github.com/GustaShow088/order-system'
  });
});

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
  console.log(`→ /api/* proxies to ${process.env.ORDER_SERVICE_URL || 'http://localhost:3001'}`);
});