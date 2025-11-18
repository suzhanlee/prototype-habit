import { PrismaClient } from '@prisma/client';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Configure web-push with VAPID keys
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@habittracker.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
} else {
  console.warn('⚠️  VAPID keys not configured. Web push notifications will not work.');
  console.warn('   Run: npx ts-node src/utils/generateVapidKeys.ts to generate keys.');
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const webPushService = {
  /**
   * Get VAPID public key for client-side subscription
   */
  getPublicKey() {
    if (!vapidPublicKey) {
      throw new Error('VAPID public key not configured');
    }
    return vapidPublicKey;
  },

  /**
   * Subscribe a user to push notifications
   */
  async subscribeToPush(userId: number, subscription: PushSubscriptionData, userAgent?: string) {
    try {
      // Check if subscription already exists
      const existing = await prisma.pushSubscription.findFirst({
        where: {
          userId,
          endpoint: subscription.endpoint,
        },
      });

      if (existing) {
        // Update existing subscription
        return await prisma.pushSubscription.update({
          where: { id: existing.id },
          data: {
            authKey: subscription.keys.auth,
            p256dhKey: subscription.keys.p256dh,
            userAgent: userAgent || existing.userAgent,
            updatedAt: new Date(),
          },
        });
      }

      // Create new subscription
      const newSubscription = await prisma.pushSubscription.create({
        data: {
          userId,
          endpoint: subscription.endpoint,
          authKey: subscription.keys.auth,
          p256dhKey: subscription.keys.p256dh,
          userAgent,
        },
      });

      return newSubscription;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      throw new Error('Failed to subscribe to push notifications');
    }
  },

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(userId: number, endpoint: string) {
    try {
      const subscription = await prisma.pushSubscription.findFirst({
        where: {
          userId,
          endpoint,
        },
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      await prisma.pushSubscription.delete({
        where: { id: subscription.id },
      });

      return { success: true, message: 'Unsubscribed from push notifications' };
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      throw new Error('Failed to unsubscribe from push notifications');
    }
  },

  /**
   * Send a push notification to a specific user
   */
  async sendPushNotification(userId: number, title: string, body: string, data?: any) {
    try {
      // Check if user has push notifications enabled
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { pushNotificationEnabled: true },
      });

      if (!user?.pushNotificationEnabled) {
        console.log(`Push notifications disabled for user ${userId}`);
        return { success: false, message: 'Push notifications disabled for user' };
      }

      // Get all push subscriptions for the user
      const subscriptions = await prisma.pushSubscription.findMany({
        where: { userId },
      });

      if (subscriptions.length === 0) {
        console.log(`No push subscriptions found for user ${userId}`);
        return { success: false, message: 'No push subscriptions found' };
      }

      // Prepare push notification payload
      const payload = JSON.stringify({
        title,
        body,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: {
          url: '/notifications',
          ...data,
        },
      });

      // Send push notification to all user's subscriptions
      const results = await Promise.allSettled(
        subscriptions.map(async (sub) => {
          try {
            const pushSubscription = {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dhKey,
                auth: sub.authKey,
              },
            };

            await webpush.sendNotification(pushSubscription, payload);
            return { success: true, endpoint: sub.endpoint };
          } catch (error: any) {
            console.error(`Failed to send push to ${sub.endpoint}:`, error.message);

            // If subscription is invalid (410 Gone or 404 Not Found), delete it
            if (error.statusCode === 410 || error.statusCode === 404) {
              console.log(`Removing invalid subscription: ${sub.endpoint}`);
              await prisma.pushSubscription.delete({
                where: { id: sub.id },
              });
            }

            return { success: false, endpoint: sub.endpoint, error: error.message };
          }
        })
      );

      const successful = results.filter(
        (r) => r.status === 'fulfilled' && r.value.success
      ).length;
      const failed = results.length - successful;

      return {
        success: successful > 0,
        message: `Push notification sent to ${successful}/${results.length} subscriptions`,
        successful,
        failed,
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw new Error('Failed to send push notification');
    }
  },

  /**
   * Send push notification to multiple users
   */
  async sendPushToMultipleUsers(
    userIds: number[],
    title: string,
    body: string,
    data?: any
  ) {
    const results = await Promise.allSettled(
      userIds.map((userId) => this.sendPushNotification(userId, title, body, data))
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;

    return {
      success: successful > 0,
      message: `Push notification sent to ${successful}/${userIds.length} users`,
      successful,
      failed: userIds.length - successful,
    };
  },

  /**
   * Get all push subscriptions for a user
   */
  async getUserSubscriptions(userId: number) {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
      select: {
        id: true,
        endpoint: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return subscriptions;
  },

  /**
   * Check if user has any active push subscriptions
   */
  async hasActiveSubscriptions(userId: number) {
    const count = await prisma.pushSubscription.count({
      where: { userId },
    });

    return count > 0;
  },

  /**
   * Remove all expired or invalid subscriptions for a user
   */
  async cleanupInvalidSubscriptions(userId: number) {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    const testPayload = JSON.stringify({
      title: 'Test',
      body: 'Connection test',
    });

    let removedCount = 0;

    for (const sub of subscriptions) {
      try {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dhKey,
            auth: sub.authKey,
          },
        };

        // Try to send a test notification
        await webpush.sendNotification(pushSubscription, testPayload);
      } catch (error: any) {
        // If subscription is invalid, delete it
        if (error.statusCode === 410 || error.statusCode === 404) {
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
          removedCount++;
        }
      }
    }

    return {
      removedCount,
      message: `Removed ${removedCount} invalid subscription(s)`,
    };
  },
};
