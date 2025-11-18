import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

// List of valid IANA timezones (common ones for dropdown)
const VALID_TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Asia/Singapore',
  'Asia/Bangkok',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];

const VALID_LOCALES = ['en', 'ko', 'ja', 'es', 'fr'];

export const userService = {
  /**
   * Get user settings
   */
  async getUserSettings(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        timezone: true,
        locale: true,
        pushNotificationEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  /**
   * Update user profile (username, avatarUrl)
   */
  async updateProfile(
    userId: number,
    data: { username?: string; avatarUrl?: string }
  ) {
    // Validate username format
    if (data.username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(data.username)) {
        throw new Error(
          'Username must be 3-30 characters, alphanumeric with underscores only'
        );
      }

      // Check if username is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          id: { not: userId },
          deletedAt: null,
        },
      });

      if (existingUser) {
        throw new Error('Username already exists');
      }
    }

    // Validate avatar URL format
    if (data.avatarUrl !== undefined && data.avatarUrl !== null && data.avatarUrl !== '') {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(data.avatarUrl)) {
        throw new Error('Avatar URL must be a valid URL');
      }
    }

    const updateData: any = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        email: true,
      },
    });

    return updatedUser;
  },

  /**
   * Update user settings (timezone, locale, notifications)
   */
  async updateSettings(
    userId: number,
    data: {
      timezone?: string;
      locale?: string;
      pushNotificationEnabled?: boolean;
    }
  ) {
    // Validate timezone
    if (data.timezone && !VALID_TIMEZONES.includes(data.timezone)) {
      throw new Error('Invalid timezone');
    }

    // Validate locale
    if (data.locale && !VALID_LOCALES.includes(data.locale)) {
      throw new Error('Invalid locale. Supported: en, ko, ja, es, fr');
    }

    const updateData: any = {};
    if (data.timezone !== undefined) updateData.timezone = data.timezone;
    if (data.locale !== undefined) updateData.locale = data.locale;
    if (data.pushNotificationEnabled !== undefined)
      updateData.pushNotificationEnabled = data.pushNotificationEnabled;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        timezone: true,
        locale: true,
        pushNotificationEnabled: true,
      },
    });

    return updatedUser;
  },

  /**
   * Change user password
   */
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ) {
    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcryptjs.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }

    // Check that new password is different from current
    const isSamePassword = await bcryptjs.compare(
      newPassword,
      user.passwordHash
    );
    if (isSamePassword) {
      throw new Error('New password cannot be the same as current password');
    }

    // Hash new password
    const newPasswordHash = await bcryptjs.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    return { message: 'Password changed successfully' };
  },

  /**
   * Delete user account (soft delete)
   */
  async deleteAccount(userId: number, password: string) {
    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Password is incorrect');
    }

    // Soft delete user
    await prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        // Anonymize email to prevent conflicts
        email: `deleted_${userId}_${Date.now()}@deleted.local`,
        username: `deleted_${userId}_${Date.now()}`,
      },
    });

    return { message: 'Account deleted successfully' };
  },
};
