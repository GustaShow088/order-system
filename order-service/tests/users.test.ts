import request from 'supertest';
import express from 'express';
import { prisma } from '../src/prisma';

const app = express();
app.use(express.json());

// Endpoint simples para testar
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
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

describe('POST /users', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: `test-${Date.now()}@email.com`,
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toContain('@email.com');
    expect(response.body.name).toBe('Test User');
  });

  it('should return 409 when email already exists', async () => {
    const email = `duplicate-${Date.now()}@email.com`;

    // Cria primeiro
    await request(app).post('/users').send({ email, name: 'First' });

    // Tenta criar de novo
    const response = await request(app)
      .post('/users')
      .send({ email, name: 'Second' });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Email already exists');
  });
});