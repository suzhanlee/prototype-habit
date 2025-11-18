import api from './api';

export interface UserSettings {
  id: number;
  email: string;
  username: string;
  avatarUrl: string | null;
  timezone: string;
  locale: string;
  pushNotificationEnabled: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  username?: string;
  avatarUrl?: string;
}

export interface UpdateSettingsData {
  timezone?: string;
  locale?: string;
  pushNotificationEnabled?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
  confirmation: string;
}

export const usersApi = {
  /**
   * Get user settings
   */
  async getUserSettings(): Promise<UserSettings> {
    const response = await api.get('/users/settings');
    return response.data.data;
  },

  /**
   * Update user profile (username, avatarUrl)
   */
  async updateProfile(data: UpdateProfileData): Promise<UserSettings> {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  },

  /**
   * Update user settings (timezone, locale, notifications)
   */
  async updateSettings(data: UpdateSettingsData): Promise<Partial<UserSettings>> {
    const response = await api.put('/users/settings', data);
    return response.data.data;
  },

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await api.post('/users/password', data);
    return response.data.data;
  },

  /**
   * Delete account
   */
  async deleteAccount(data: DeleteAccountData): Promise<{ message: string }> {
    const response = await api.delete('/users/account', { data });
    return response.data.data;
  },
};

/**
 * Timezone options for dropdown
 */
export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'New York (UTC-5)' },
  { value: 'America/Chicago', label: 'Chicago (UTC-6)' },
  { value: 'America/Denver', label: 'Denver (UTC-7)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC-8)' },
  { value: 'America/Toronto', label: 'Toronto (UTC-5)' },
  { value: 'Europe/London', label: 'London (UTC+0)' },
  { value: 'Europe/Paris', label: 'Paris (UTC+1)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
  { value: 'Europe/Moscow', label: 'Moscow (UTC+3)' },
  { value: 'Asia/Dubai', label: 'Dubai (UTC+4)' },
  { value: 'Asia/Kolkata', label: 'Kolkata (UTC+5:30)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (UTC+9)' },
  { value: 'Asia/Seoul', label: 'Seoul (UTC+9)' },
  { value: 'Asia/Singapore', label: 'Singapore (UTC+8)' },
  { value: 'Asia/Bangkok', label: 'Bangkok (UTC+7)' },
  { value: 'Australia/Sydney', label: 'Sydney (UTC+10)' },
  { value: 'Pacific/Auckland', label: 'Auckland (UTC+12)' },
  { value: 'UTC', label: 'UTC (UTC+0)' },
];

/**
 * Locale options for dropdown
 */
export const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'ko', label: '한국어' },
  { value: 'ja', label: '日本語' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
];

/**
 * Validate username format
 */
export function validateUsername(username: string): string | null {
  if (!username) {
    return '사용자명을 입력하세요';
  }
  if (username.length < 3) {
    return '사용자명은 최소 3자 이상이어야 합니다';
  }
  if (username.length > 30) {
    return '사용자명은 최대 30자까지 가능합니다';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return '사용자명은 영문, 숫자, 밑줄(_)만 사용 가능합니다';
  }
  return null;
}

/**
 * Validate avatar URL format
 */
export function validateAvatarUrl(url: string): string | null {
  if (!url || url.trim() === '') {
    return null; // Empty is valid
  }
  if (!/^https?:\/\/.+/.test(url)) {
    return '올바른 URL 형식이 아닙니다 (http:// 또는 https://)';
  }
  return null;
}

/**
 * Validate password format
 */
export function validatePassword(password: string): string | null {
  if (!password) {
    return '비밀번호를 입력하세요';
  }
  if (password.length < 8) {
    return '비밀번호는 최소 8자 이상이어야 합니다';
  }
  return null;
}

/**
 * Calculate password strength
 */
export function calculatePasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) {
    return { score: 0, label: '없음', color: 'gray' };
  }

  let score = 0;

  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complexity
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { score, label: '약함', color: 'red' };
  } else if (score <= 4) {
    return { score, label: '보통', color: 'yellow' };
  } else if (score <= 6) {
    return { score, label: '강함', color: 'green' };
  } else {
    return { score, label: '매우 강함', color: 'blue' };
  }
}
