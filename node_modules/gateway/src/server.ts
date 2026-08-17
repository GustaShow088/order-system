import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'gateway', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Hello World from Gateway!' });
});

app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
});