import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { generateToken, generateRefreshToken } from '../middleware/auth';

const prisma = new PrismaClient();

// Password validation function
const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Minimum length
  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }

  // Maximum length
  if (password.length > 128) {
    errors.push('비밀번호는 최대 128자까지 가능합니다.');
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('비밀번호는 최소 하나의 소문자를 포함해야 합니다.');
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('비밀번호는 최소 하나의 대문자를 포함해야 합니다.');
  }

  // At least one number
  if (!/\d/.test(password)) {
    errors.push('비밀번호는 최소 하나의 숫자를 포함해야 합니다.');
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('비밀번호는 최소 하나의 특수문자를 포함해야 합니다.');
  }

  // Cannot contain common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'password1', 'qwerty123'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('너무 쉬운 비밀번호는 사용할 수 없습니다.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const authService = {
  async register(email: string, username: string, password: string) {
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(' '));
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new Error('Email or username already exists');
    }

    // Hash password with stronger salt rounds
    const passwordHash = await bcryptjs.hash(password, 12);

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
