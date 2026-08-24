import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware } from './middleware/auth';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting em TODAS as rotas
app.use(apiLimiter);

// Health check (público)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gateway', timestamp: new Date().toISOString() });
});

// Raiz
app.get('/', (_req, res) => {
  res.json({
    service: 'order-system-gateway',
    status: 'running',
    endpoints: ['/health', '/api/users', '/api/orders', '/api/protected/orders'],
    docs: 'https://github.com/GustaShow088/order-system'
  });
});

// ROTA PROTEGIDA — deve vir ANTES do proxy
app.get('/api/protected/orders', authMiddleware, (req, res) => {
  res.json({ message: 'Acesso autorizado', user: (req as any).user });
});

// Proxy para o Order Service (rotas públicas)
// Isso captura /api/users, /api/orders, etc.
app.use(
  '/api',
  createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL || 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/api': '' },
  })
);

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});