# Notification System PRD

## 1. Feature Overview

The Notification System enables users to receive real-time updates about their habit tracking activities through in-app notifications and web push notifications. This system helps users stay engaged with their habits by providing timely reminders, achievement alerts, and streak updates.

### Key Features
- **In-App Notifications**: View notifications within the application
- **Web Push Notifications**: Receive browser push notifications even when the app is not open
- **Notification Management**: Mark notifications as read, delete, and view notification history
- **Multiple Notification Types**: Support for reminders, streak achievements, and milestone celebrations
- **Unread Count Badge**: Visual indicator of unread notifications
- **User Preferences**: Enable/disable push notifications per user

## 2. User Stories

### US-1: View Notifications
**As a** habit tracker user
**I want to** view all my notifications in one place
**So that** I can stay informed about my habit progress and reminders

**Acceptance Criteria:**
- User can access notifications from a notification bell icon in the header
- Notification list shows the most recent notifications first
- Each notification displays: type icon, title, body text, and timestamp
- Unread notifications are visually distinct from read notifications
- User can see a badge with unread count on the notification bell

### US-2: Manage Notifications
**As a** habit tracker user
**I want to** mark notifications as read or delete them
**So that** I can keep my notification list organized

**Acceptance Criteria:**
- User can mark individual notifications as read
- User can delete individual notifications
- Marking a notification as read updates the unread count badge
- Deleted notifications are removed from the list immediately

### US-3: Receive Achievement Notifications
**As a** habit tracker user
**I want to** receive notifications when I complete habits or achieve streaks
**So that** I feel motivated to continue tracking my habits

**Acceptance Criteria:**
- User receives a notification when completing a habit log
- Notification includes the habit name and congratulatory message
- User receives notifications for streak milestones (7, 30, 100 days, etc.)

### US-4: Enable Push Notifications
**As a** habit tracker user
**I want to** enable browser push notifications
**So that** I can receive updates even when the app is not open

**Acceptance Criteria:**
- User can subscribe to push notifications from settings or notification page
- Browser prompts user for notification permission
- User can unsubscribe from push notifications at any time
- Push notifications appear in the browser notification center
- Clicking a push notification opens the habit tracking app

### US-5: Receive Habit Reminders
**As a** habit tracker user
**I want to** receive reminder notifications for habits at scheduled times
**So that** I don't forget to complete my daily habits

**Acceptance Criteria:**
- Reminders are sent based on habit's reminderTime setting
- Reminder notifications include the habit name and target value
- Reminders are only sent if habit's reminderEnabled is true
- Reminders respect user's pushNotificationEnabled setting

## 3. Technical Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NotificationBell  │  NotificationList  │  Settings  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Service Worker (Push Notifications)           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Express)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Notification API  │  WebPush API  │  Auth Middleware│  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  NotificationService  │  WebPushService              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Prisma)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Notifications  │  PushSubscriptions  │  Users        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- web-push library (for VAPID and push notifications)

**Frontend:**
- Next.js 14 (App Router)
- React
- TypeScript
- Service Workers API
- Notifications API

**Database:**
- PostgreSQL
- Tables: `notifications`, `push_subscriptions`

## 4. API Specifications

### 4.1 Notification Endpoints

#### GET /api/notifications
Get user's notifications with pagination

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional, default: 20): Number of notifications to fetch
- `offset` (optional, default: 0): Pagination offset

**Response 200:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "userId": 1,
        "habitId": 5,
        "type": "achievement",
        "title": "Habit Completed!",
        "body": "Great job! You completed 'Morning Exercise'",
        "isRead": false,
        "scheduledAt": null,
        "sentAt": "2025-11-18T10:30:00Z",
        "createdAt": "2025-11-18T10:30:00Z",
        "habit": {
          "id": 5,
          "name": "Morning Exercise",
          "colorHex": "#3B82F6"
        }
      }
    ],
    "total": 45,
    "hasMore": true
  }
}
```

#### POST /api/notifications/read/:id
Mark notification as read

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Notification ID

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "isRead": true,
    "updatedAt": "2025-11-18T10:35:00Z"
  }
}
```

#### DELETE /api/notifications/:id
Delete a notification

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `id`: Notification ID

**Response 200:**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

#### GET /api/notifications/unread-count
Get count of unread notifications

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### 4.2 Web Push Endpoints

#### POST /api/notifications/subscribe
Subscribe to push notifications

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BG3...",
      "auth": "hJW..."
    }
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "createdAt": "2025-11-18T10:40:00Z"
  }
}
```

#### POST /api/notifications/unsubscribe
Unsubscribe from push notifications

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/..."
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Unsubscribed from push notifications"
}
```

#### GET /api/notifications/vapid-public-key
Get VAPID public key for push subscription

**Response 200:**
```json
{
  "success": true,
  "data": {
    "publicKey": "BG3K4..."
  }
}
```

#### POST /api/notifications/push
Send a test push notification (for testing purposes)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Test Notification",
  "body": "This is a test push notification"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Push notification sent"
}
```

## 5. Database Schema

The database schema already exists in Prisma. Reference the following tables:

### Notifications Table
```prisma
model Notification {
  id          Int       @id @default(autoincrement())
  userId      Int
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  habitId     Int?
  habit       Habit?    @relation(fields: [habitId], references: [id], onDelete: SetNull)

  type        String    // reminder, streak, achievement
  title       String
  body        String?
  isRead      Boolean   @default(false)
  scheduledAt DateTime?
  sentAt      DateTime?
  createdAt   DateTime  @default(now())

  @@index([userId, createdAt])
  @@index([scheduledAt])
  @@map("notifications")
}
```

### PushSubscriptions Table
```prisma
model PushSubscription {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  endpoint   String
  authKey    String
  p256dhKey  String
  userAgent  String?

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([userId, endpoint])
  @@index([userId])
  @@map("push_subscriptions")
}
```

### Notification Types
- **reminder**: Scheduled reminders for habits
- **achievement**: Habit completion notifications
- **streak**: Streak milestone notifications (7, 30, 50, 100 days)

## 6. Frontend Requirements

### 6.1 Components

#### NotificationBell Component
**Location:** `frontend/components/notifications/NotificationBell.tsx`

**Features:**
- Display bell icon in header
- Show unread count badge
- Toggle dropdown with recent notifications
- Link to full notifications page

**Props:**
- None (fetches data internally)

**State:**
- `unreadCount`: number
- `recentNotifications`: Notification[]
- `isOpen`: boolean

#### NotificationList Component
**Location:** `frontend/components/notifications/NotificationList.tsx`

**Features:**
- Display paginated list of notifications
- Infinite scroll or load more button
- Empty state when no notifications
- Loading state

**Props:**
- `notifications`: Notification[]
- `onMarkAsRead`: (id: number) => void
- `onDelete`: (id: number) => void
- `onLoadMore`: () => void
- `hasMore`: boolean

#### NotificationItem Component
**Location:** `frontend/components/notifications/NotificationItem.tsx`

**Features:**
- Display notification icon based on type
- Show title, body, and timestamp
- Mark as read button
- Delete button
- Visual distinction for unread notifications
- Link to related habit if applicable

**Props:**
- `notification`: Notification
- `onMarkAsRead`: (id: number) => void
- `onDelete`: (id: number) => void

#### PushNotificationManager Component
**Location:** `frontend/components/notifications/PushNotificationManager.tsx`

**Features:**
- Subscribe/unsubscribe toggle
- Permission status display
- Instructions for enabling notifications
- Test notification button

**Props:**
- None (manages state internally)

**State:**
- `isSubscribed`: boolean
- `permission`: NotificationPermission
- `isLoading`: boolean

### 6.2 Pages

#### Notifications Page
**Location:** `frontend/app/notifications/page.tsx`

**Features:**
- Full-page notification list
- Filter by read/unread
- Mark all as read button
- Push notification settings section
- Responsive design

### 6.3 Service Worker

#### Service Worker
**Location:** `frontend/public/sw.js`

**Features:**
- Register service worker on app load
- Handle push events
- Display push notifications
- Handle notification click events
- Focus or open app window on click

**Events:**
- `push`: Receive and display push notification
- `notificationclick`: Handle user clicking notification

### 6.4 Integration Points

1. **Dashboard Layout**: Add NotificationBell to header
2. **Auth Context**: Subscribe to push on login (if previously subscribed)
3. **Habit Completion**: Trigger notification creation on habit log
4. **Settings Page**: Add notification preferences (future enhancement)

## 7. Testing Strategy

### 7.1 Backend Testing

#### Unit Tests
**Location:** `backend/src/tests/notification.service.test.ts`

**Test Cases:**
1. Create notification successfully
2. Get user's notifications with pagination
3. Mark notification as read
4. Delete notification
5. Get unread count
6. Prevent unauthorized access to other users' notifications

#### Integration Tests
**Location:** `backend/src/tests/notification.api.test.ts`

**Test Cases:**
1. GET /api/notifications returns user's notifications
2. POST /api/notifications/read/:id marks notification as read
3. DELETE /api/notifications/:id deletes notification
4. GET /api/notifications/unread-count returns correct count
5. All endpoints require authentication
6. Pagination works correctly

#### WebPush Tests
**Location:** `backend/src/tests/webpush.service.test.ts`

**Test Cases:**
1. Subscribe to push notifications
2. Unsubscribe from push notifications
3. Send push notification to user
4. Handle invalid subscriptions
5. VAPID keys are properly configured

### 7.2 Frontend Testing

#### Component Tests
**Test Cases:**
1. NotificationBell displays unread count
2. NotificationList renders notifications correctly
3. NotificationItem shows correct notification type icon
4. PushNotificationManager handles subscription flow
5. Notifications page loads and displays data

#### Integration Tests
**Test Cases:**
1. User can mark notification as read
2. User can delete notification
3. Unread count updates after marking as read
4. User can subscribe to push notifications
5. Service worker registers successfully

### 7.3 Manual Testing

#### Push Notification Flow
1. Open app in browser that supports push (Chrome, Firefox, Edge)
2. Navigate to notifications page
3. Click "Enable Push Notifications"
4. Grant permission in browser prompt
5. Verify subscription is saved
6. Complete a habit
7. Verify push notification appears in browser
8. Click notification and verify app opens
9. Unsubscribe from notifications
10. Verify no more push notifications received

#### In-App Notification Flow
1. Complete a habit log
2. Verify notification appears in notification bell
3. Verify unread count increases
4. Open notification dropdown
5. Click notification to view details
6. Mark as read
7. Verify unread count decreases
8. Delete notification
9. Verify notification is removed

#### Edge Cases
1. Test with notifications disabled in browser settings
2. Test with multiple browser tabs open
3. Test push notifications when app is closed
4. Test notification delivery failure handling
5. Test with no internet connection

### 7.4 Performance Testing

**Metrics to Monitor:**
1. Time to fetch notifications (target: < 200ms)
2. Time to send push notification (target: < 500ms)
3. Database query performance for large notification lists
4. Service worker registration time
5. Memory usage with multiple notifications

### 7.5 Security Testing

**Security Checks:**
1. Users cannot access other users' notifications
2. Push subscriptions are properly validated
3. VAPID keys are stored securely (environment variables)
4. Authentication required for all notification endpoints
5. Input validation for notification creation

## 8. Future Enhancements

### Phase 2 Features
1. **Notification Preferences**: Granular control over notification types
2. **Scheduled Reminders**: Cron job for scheduled notification delivery
3. **Rich Notifications**: Images and action buttons in push notifications
4. **Notification Sounds**: Custom sounds for different notification types
5. **Email Notifications**: Send notifications via email
6. **Notification History**: Archive and search old notifications
7. **Smart Notifications**: ML-based optimal reminder times
8. **Group Notifications**: Bundle multiple notifications of same type
9. **Notification Analytics**: Track engagement with notifications
10. **Multi-Device Sync**: Sync read status across devices

### Technical Debt
1. Add comprehensive error handling and retry logic for push failures
2. Implement notification queuing system for high volume
3. Add monitoring and alerting for notification delivery failures
4. Optimize database queries with proper indexing
5. Add caching layer for frequent notification queries

## 9. Success Metrics

### KPIs
1. **Notification Delivery Rate**: % of notifications successfully delivered
2. **Click-Through Rate**: % of notifications clicked by users
3. **Subscription Rate**: % of users who enable push notifications
4. **Engagement Rate**: % of users who interact with notifications
5. **Unsubscribe Rate**: % of users who disable notifications

### Target Metrics (3 months post-launch)
- 70% push notification subscription rate
- 90%+ notification delivery success rate
- 30%+ notification click-through rate
- < 5% unsubscribe rate
- 50%+ weekly active notification users

## 10. Rollout Plan

### Phase 1: MVP (Current Implementation)
- In-app notifications
- Web push notifications
- Basic notification management
- Achievement and completion notifications

### Phase 2: Enhancements (Future)
- Scheduled reminders with cron jobs
- Notification preferences UI
- Email notifications
- Rich push notifications

### Phase 3: Advanced Features (Future)
- Smart notification timing
- Notification analytics
- Multi-device sync
- Group notifications

## 11. Dependencies

### Required Libraries
- **Backend**: `web-push` (already installed)
- **Frontend**: Native Web APIs (Push API, Service Worker API, Notifications API)

### Environment Variables
```
# Backend .env
VAPID_PUBLIC_KEY=<generated_public_key>
VAPID_PRIVATE_KEY=<generated_private_key>
VAPID_SUBJECT=mailto:admin@habittracker.com
```

### Browser Support
- Chrome 50+
- Firefox 44+
- Edge 17+
- Safari 16+ (macOS only)
- Opera 37+

**Note**: iOS Safari does not support web push notifications as of 2024. Mobile push would require native app or PWA with alternative notification strategy.

## 12. Risks and Mitigations

### Risk 1: Low Push Notification Adoption
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Clear value proposition when prompting for permission
- Don't prompt immediately on first visit
- Provide preview of notification benefits
- Allow easy re-subscription if user declines initially

### Risk 2: Browser Compatibility Issues
**Impact**: Medium
**Probability**: Medium
**Mitigation**:
- Graceful degradation for unsupported browsers
- Feature detection before enabling push
- Clear messaging about browser requirements
- Fallback to in-app notifications only

### Risk 3: Notification Fatigue
**Impact**: High
**Probability**: Medium
**Mitigation**:
- Don't over-notify users
- Provide granular notification preferences
- Respect user's quiet hours
- Smart bundling of similar notifications

### Risk 4: Push Service Failures
**Impact**: High
**Probability**: Low
**Mitigation**:
- Implement retry logic with exponential backoff
- Monitor delivery success rates
- Graceful error handling
- Fallback to in-app notifications
- Alert system for sustained failures

## 13. Documentation

### Developer Documentation
- API endpoint documentation (this PRD)
- Service worker implementation guide
- Push notification setup guide
- Testing procedures
- Troubleshooting guide

### User Documentation
- How to enable push notifications
- How to manage notification preferences
- Browser compatibility information
- Privacy information about notifications

---

**Document Version**: 1.0
**Last Updated**: 2025-11-18
**Author**: Agent 1 - Notification System Team
**Status**: Implementation Ready
