import api from './api';

export interface Notification {
  id: number;
  userId: number;
  habitId?: number;
  type: 'reminder' | 'achievement' | 'streak';
  title: string;
  body?: string;
  isRead: boolean;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  habit?: {
    id: number;
    name: string;
    colorHex: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const notificationsApi = {
  /**
   * Get user's notifications with pagination
   */
  async getNotifications(limit: number = 20, offset: number = 0): Promise<NotificationsResponse> {
    const response = await api.get('/notifications', {
      params: { limit, offset },
    });
    return response.data.data;
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(id: number): Promise<Notification> {
    const response = await api.post(`/notifications/read/${id}`);
    return response.data.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ count: number }> {
    const response = await api.post('/notifications/mark-all-read');
    return response.data.data;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/notifications/${id}`);
    return response.data.data;
  },

  /**
   * Get count of unread notifications
   */
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data;
  },

  /**
   * Get VAPID public key for push subscription
   */
  async getVapidPublicKey(): Promise<string> {
    const response = await api.get('/notifications/vapid-public-key');
    return response.data.data.publicKey;
  },

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(subscription: PushSubscription): Promise<any> {
    const response = await api.post('/notifications/subscribe', {
      subscription,
    });
    return response.data.data;
  },

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(endpoint: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/notifications/unsubscribe', {
      endpoint,
    });
    return response.data.data;
  },

  /**
   * Send a test push notification
   */
  async sendTestPush(title: string, body: string): Promise<any> {
    const response = await api.post('/notifications/push', {
      title,
      body,
    });
    return response.data.data;
  },

  /**
   * Get user's push subscriptions
   */
  async getSubscriptions(): Promise<any[]> {
    const response = await api.get('/notifications/subscriptions');
    return response.data.data.subscriptions;
  },
};
