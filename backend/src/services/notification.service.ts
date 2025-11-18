import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNotificationData {
  userId: number;
  habitId?: number;
  type: 'reminder' | 'achievement' | 'streak';
  title: string;
  body?: string;
  scheduledAt?: Date;
}

export const notificationService = {
  /**
   * Create a new notification for a user
   */
  async createNotification(data: CreateNotificationData) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        habitId: data.habitId,
        type: data.type,
        title: data.title,
        body: data.body,
        scheduledAt: data.scheduledAt,
        sentAt: data.scheduledAt ? null : new Date(), // Set sentAt if not scheduled
      },
      include: {
        habit: {
          select: {
            id: true,
            name: true,
            colorHex: true,
          },
        },
      },
    });

    return notification;
  },

  /**
   * Get user's notifications with pagination
   */
  async getNotifications(userId: number, limit: number = 20, offset: number = 0) {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: {
          userId,
        },
        include: {
          habit: {
            select: {
              id: true,
              name: true,
              colorHex: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({
        where: {
          userId,
        },
      }),
    ]);

    return {
      notifications,
      total,
      hasMore: offset + limit < total,
    };
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: number, userId: number) {
    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const updated = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    });

    return updated;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: number, userId: number) {
    // Verify notification belongs to user
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await prisma.notification.delete({
      where: {
        id: notificationId,
      },
    });

    return { success: true, message: 'Notification deleted' };
  },

  /**
   * Get count of unread notifications for a user
   */
  async getUnreadCount(userId: number) {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: number) {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return { count: result.count };
  },

  /**
   * Create a habit completion notification
   */
  async createHabitCompletionNotification(userId: number, habitId: number, habitName: string) {
    const messages = [
      `Great job! You completed '${habitName}'`,
      `Well done! '${habitName}' is checked off for today`,
      `Awesome! You've completed '${habitName}'`,
      `Keep it up! '${habitName}' is done`,
      `Fantastic! '${habitName}' completed successfully`,
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return this.createNotification({
      userId,
      habitId,
      type: 'achievement',
      title: 'Habit Completed!',
      body: randomMessage,
    });
  },

  /**
   * Create a streak milestone notification
   */
  async createStreakNotification(
    userId: number,
    habitId: number,
    habitName: string,
    streakCount: number
  ) {
    let title = 'Streak Milestone!';
    let body = `${streakCount} day streak on '${habitName}'`;

    // Special messages for milestone streaks
    if (streakCount === 7) {
      title = '7 Day Streak!';
      body = `Amazing! You've maintained '${habitName}' for a whole week!`;
    } else if (streakCount === 30) {
      title = '30 Day Streak!';
      body = `Incredible! You've been doing '${habitName}' for a month!`;
    } else if (streakCount === 50) {
      title = '50 Day Streak!';
      body = `Outstanding! 50 days of '${habitName}' - you're unstoppable!`;
    } else if (streakCount === 100) {
      title = '100 Day Streak!';
      body = `LEGENDARY! 100 days of '${habitName}' - you're a habit master!`;
    } else if (streakCount % 10 === 0 && streakCount > 0) {
      // Every 10 days
      body = `${streakCount} days strong on '${habitName}'! Keep going!`;
    } else {
      // Don't create notification for non-milestone streaks
      return null;
    }

    return this.createNotification({
      userId,
      habitId,
      type: 'streak',
      title,
      body,
    });
  },

  /**
   * Create a habit reminder notification
   */
  async createReminderNotification(
    userId: number,
    habitId: number,
    habitName: string,
    targetValue?: string
  ) {
    const body = targetValue
      ? `Don't forget to complete '${habitName}' (${targetValue}) today!`
      : `Time to do '${habitName}'!`;

    return this.createNotification({
      userId,
      habitId,
      type: 'reminder',
      title: 'Habit Reminder',
      body,
    });
  },
};
