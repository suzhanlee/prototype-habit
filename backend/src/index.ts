import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';
import habitLogRoutes from './routes/habitlog.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/habits', habitLogRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    error: { message: 'Not found', status: 404 },
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📚 API Routes:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   POST   /api/auth/refresh`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/habits`);
  console.log(`   POST   /api/habits`);
  console.log(`   GET    /api/habits/:id`);
  console.log(`   PUT    /api/habits/:id`);
  console.log(`   DELETE /api/habits/:id`);
  console.log(`   PATCH  /api/habits/:id/toggle`);
  console.log(`   POST   /api/habits/:id/logs`);
  console.log(`   GET    /api/habits/:id/logs`);
  console.log(`   PUT    /api/habits/:id/logs/:logId`);
  console.log(`   DELETE /api/habits/:id/logs/:logId`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

export { app, prisma };
