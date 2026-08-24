import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'mock-secret-key';

// Gera um token fake (só para teste)
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
};

// Middleware que valida o token
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>"

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };
    (req as any).user = decoded; // anexa o usuário na request
    next();
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
};