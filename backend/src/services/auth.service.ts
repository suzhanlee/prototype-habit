import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../middleware/auth';

const prisma = new PrismaClient();

export const authService = {
  async register(email: string, username: string, password: string) {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('Email or username already exists');
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
    });

    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcryptjs.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = generateToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      token,
      refreshToken,
    };
  },

  async refreshToken(token: string) {
    try {
      const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newToken = generateToken(user.id, user.email);
      const newRefreshToken = generateRefreshToken(user.id, user.email);

      return {
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new Error('Invalid refresh token');
    }
  },

  async getUser(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        timezone: true,
        locale: true,
        pushNotificationEnabled: true,
      },
    });

    return user;
  },
};
