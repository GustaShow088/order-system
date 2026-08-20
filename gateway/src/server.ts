import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3001';

app.get('/', (_req, res) => {
  res.json({
    service: 'order-system-gateway',
    status: 'running',
    endpoints: ['/health', '/api/users', '/api/orders'],
    docs: 'https://github.com/GustaShow088/order-system'
  });
});

// Tudo que começa com /api/orders ou /api/users vai para o order-service
app.use(
  '/api',
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  }),
);

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
  console.log(`→ /api/* proxies to ${ORDER_SERVICE_URL}`);
});