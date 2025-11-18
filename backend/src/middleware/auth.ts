import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: { message: 'Unauthorized', status: 401 } });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: { message: 'Invalid token', status: 401 } });
  }
};

export const generateToken = (userId: number, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

export const generateRefreshToken = (userId: number, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d' }
  );
};
