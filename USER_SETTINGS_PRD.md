# User Settings & Profile Management - Product Requirements Document

## 1. Feature Overview

The User Settings & Profile Management system provides users with complete control over their account, profile information, preferences, and security settings. This feature enables users to customize their experience, manage their personal information, update security credentials, and control their account lifecycle.

### Key Capabilities
- Profile customization (username, avatar)
- Localization settings (timezone, language)
- Notification preferences management
- Password change with security verification
- Account deletion with confirmation
- Settings persistence across sessions

## 2. User Stories

### 2.1 Profile Management
**As a user**, I want to:
- Update my username so I can personalize my profile
- Upload or change my avatar image to have a visual identity
- View my current profile information at any time
- See when my account was created

**Acceptance Criteria**:
- Username must be unique across the system
- Username must be 3-30 characters, alphanumeric with underscores
- Avatar URL must be a valid URL format
- Profile updates are reflected immediately across the application
- Username conflicts are handled gracefully with clear error messages

### 2.2 Application Settings
**As a user**, I want to:
- Set my timezone so habit tracking aligns with my local time
- Choose my preferred language for the interface
- Enable/disable push notifications globally
- Have my settings persist across devices and sessions

**Acceptance Criteria**:
- Timezone changes update all date/time displays immediately
- Supported locales: English (en), Korean (ko), Japanese (ja), Spanish (es), French (fr)
- Notification preference changes take effect immediately
- Settings are saved to the database and survive logout/login

### 2.3 Security Management
**As a user**, I want to:
- Change my password when needed
- Verify my current password before making changes
- Receive confirmation when password is changed
- Know that my password is securely stored

**Acceptance Criteria**:
- Current password must be verified before allowing change
- New password must be at least 8 characters
- Password strength requirements are clearly communicated
- Passwords are hashed using bcrypt with salt rounds >= 10
- Old password cannot be reused as new password
- Session remains active after password change

### 2.4 Account Deletion
**As a user**, I want to:
- Delete my account permanently
- Be warned about the consequences before deletion
- Verify my identity with password before deletion
- Know that my data will be removed

**Acceptance Criteria**:
- User must enter current password to confirm deletion
- Clear warning message explains data will be deleted
- Soft delete implemented (deletedAt timestamp)
- User is logged out immediately after deletion
- Deleted accounts cannot log in
- Related data (habits, logs) are cascade deleted or anonymized

## 3. API Specifications

### 3.1 Get User Settings
**Endpoint**: `GET /api/users/settings`
**Auth**: Required (Bearer token)

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "timezone": "Asia/Seoul",
    "locale": "ko",
    "pushNotificationEnabled": true,
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### 3.2 Update Profile
**Endpoint**: `PUT /api/users/profile`
**Auth**: Required (Bearer token)

**Request Body**:
```json
{
  "username": "new_username",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "new_username",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
}
```

**Error 400** (Username taken):
```json
{
  "error": {
    "message": "Username already exists",
    "status": 400
  }
}
```

**Error 400** (Invalid username):
```json
{
  "error": {
    "message": "Username must be 3-30 characters, alphanumeric with underscores only",
    "status": 400
  }
}
```

### 3.3 Update Settings
**Endpoint**: `PUT /api/users/settings`
**Auth**: Required (Bearer token)

**Request Body**:
```json
{
  "timezone": "America/New_York",
  "locale": "en",
  "pushNotificationEnabled": false
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "timezone": "America/New_York",
    "locale": "en",
    "pushNotificationEnabled": false
  }
}
```

**Error 400** (Invalid timezone):
```json
{
  "error": {
    "message": "Invalid timezone",
    "status": 400
  }
}
```

### 3.4 Change Password
**Endpoint**: `POST /api/users/password`
**Auth**: Required (Bearer token)

**Request Body**:
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

**Error 400** (Wrong current password):
```json
{
  "error": {
    "message": "Current password is incorrect",
    "status": 400
  }
}
```

**Error 400** (Weak password):
```json
{
  "error": {
    "message": "New password must be at least 8 characters",
    "status": 400
  }
}
```

**Error 400** (Same password):
```json
{
  "error": {
    "message": "New password cannot be the same as current password",
    "status": 400
  }
}
```

### 3.5 Delete Account
**Endpoint**: `DELETE /api/users/account`
**Auth**: Required (Bearer token)

**Request Body**:
```json
{
  "password": "currentpassword123",
  "confirmation": "DELETE"
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "message": "Account deleted successfully"
  }
}
```

**Error 400** (Wrong password):
```json
{
  "error": {
    "message": "Password is incorrect",
    "status": 400
  }
}
```

**Error 400** (Missing confirmation):
```json
{
  "error": {
    "message": "Please type DELETE to confirm",
    "status": 400
  }
}
```

## 4. Frontend Requirements

### 4.1 Settings Page Layout
**Route**: `/settings`
**Auth**: Required (protected route)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│         Settings Header             │
├─────────────────────────────────────┤
│ [Profile] [Settings] [Security]     │
├─────────────────────────────────────┤
│                                     │
│     Active Tab Content              │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

### 4.2 Profile Tab
**Components**:
- Avatar display with upload option
- Username input field
- Email display (read-only)
- Account creation date display
- Save button
- Cancel button

**Validation**:
- Username: 3-30 characters, alphanumeric + underscores
- Avatar URL: Valid URL format or empty
- Real-time validation feedback
- Disable save button if no changes or invalid input

**User Experience**:
- Show loading state during save
- Display success message on save
- Show error message with details on failure
- Reset form on cancel

### 4.3 Settings Tab
**Components**:
- Timezone dropdown (searchable)
- Language/Locale selector
- Push notification toggle switch
- Save button
- Cancel button

**Timezone List**:
- Common timezones at top
- Full IANA timezone database
- Search/filter capability
- Display format: "Region/City (UTC offset)"

**Locale Options**:
- English (en)
- Korean (ko)
- Japanese (ja)
- Spanish (es)
- French (fr)

**User Experience**:
- Show current values on load
- Indicate unsaved changes
- Confirm before navigating away with unsaved changes
- Apply changes immediately on save

### 4.4 Security Tab
**Components**:

**Password Change Section**:
- Current password input (password type)
- New password input (password type)
- Confirm new password input (password type)
- Password strength indicator
- Show/hide password toggles
- Change password button

**Validation**:
- Current password required
- New password >= 8 characters
- New password != current password
- New password must match confirmation
- Show validation errors inline

**Danger Zone Section**:
- Prominent warning box with red border
- Delete account button (red, secondary style)
- Opens confirmation modal

**Delete Account Modal**:
- Warning text explaining consequences
- Password input field
- Confirmation text input (must type "DELETE")
- Cancel button
- Delete account button (disabled until validated)

**User Experience**:
- Clear password on successful change
- Show success message after password change
- Lock form during API calls
- Auto-logout after account deletion

### 4.5 Responsive Design
**Mobile (< 768px)**:
- Stack tabs vertically
- Full-width form inputs
- Touch-friendly buttons
- Collapsible sections

**Tablet (768px - 1024px)**:
- Horizontal tabs
- Two-column form layouts where appropriate
- Adequate touch targets

**Desktop (> 1024px)**:
- Horizontal tabs
- Optimal form widths (max 600px)
- Hover states on interactive elements

## 5. Password Security Considerations

### 5.1 Storage
- Use bcrypt for password hashing
- Minimum 10 salt rounds (current: 10)
- Never store plain text passwords
- Never log passwords

### 5.2 Validation
**Minimum Requirements**:
- At least 8 characters
- No maximum length (up to database limit)

**Recommendations** (displayed to user):
- Use mix of uppercase, lowercase, numbers, symbols
- Avoid common passwords
- Don't reuse passwords from other sites

### 5.3 Change Password Flow
1. User enters current password
2. Backend verifies current password hash
3. Check new password != current password
4. Validate new password meets requirements
5. Hash new password with bcrypt
6. Update database
7. Return success (no password in response)
8. Keep user logged in (don't invalidate session)

### 5.4 Security Best Practices
- Rate limit password change attempts (max 5/hour)
- Rate limit account deletion attempts (max 3/hour)
- Log password changes for audit
- Don't reveal if username exists on errors
- Use HTTPS for all API calls
- Include CSRF tokens if applicable
- Implement password complexity meter
- Warn about password reuse (optional)

## 6. Testing Strategy

### 6.1 Backend Unit Tests
**user.service.ts Tests**:
- `updateProfile()`:
  - Successfully updates username
  - Successfully updates avatarUrl
  - Rejects duplicate username
  - Validates username format
  - Handles missing optional fields

- `updateSettings()`:
  - Updates timezone successfully
  - Updates locale successfully
  - Updates notification preference
  - Validates timezone format
  - Validates locale options

- `changePassword()`:
  - Verifies current password
  - Rejects wrong current password
  - Validates new password length
  - Prevents reusing current password
  - Hashes new password correctly

- `deleteAccount()`:
  - Verifies password before deletion
  - Soft deletes user (sets deletedAt)
  - Rejects wrong password
  - Cascades to related data

### 6.2 Backend Integration Tests
**user.routes.ts Tests**:
- All endpoints require authentication
- GET /api/users/settings returns user data
- PUT /api/users/profile updates and returns data
- PUT /api/users/settings updates preferences
- POST /api/users/password changes password
- DELETE /api/users/account deletes user
- 401 for unauthenticated requests
- 400 for invalid input data
- 404 for non-existent users

### 6.3 Frontend Component Tests
**ProfileForm.tsx**:
- Renders with current user data
- Validates username format
- Validates avatar URL
- Disables save when invalid
- Calls API on submit
- Shows success/error messages

**SettingsForm.tsx**:
- Renders timezone dropdown
- Renders locale selector
- Renders notification toggle
- Saves settings on submit
- Tracks unsaved changes

**PasswordForm.tsx**:
- Validates password requirements
- Shows password strength
- Prevents submission if invalid
- Clears form on success
- Shows error messages

**AccountDangerZone.tsx**:
- Opens confirmation modal
- Requires password input
- Requires DELETE confirmation
- Calls delete API
- Logs out user after deletion

### 6.4 E2E Testing Scenarios
1. **Profile Update Flow**:
   - Login
   - Navigate to settings
   - Change username
   - Save and verify update

2. **Settings Change Flow**:
   - Login
   - Navigate to settings
   - Change timezone and locale
   - Verify changes persist after logout/login

3. **Password Change Flow**:
   - Login
   - Navigate to security tab
   - Change password
   - Logout and login with new password

4. **Account Deletion Flow**:
   - Login
   - Navigate to security tab
   - Delete account
   - Verify cannot login afterward

### 6.5 Manual Testing Checklist
- [ ] All form validations work correctly
- [ ] Error messages are clear and helpful
- [ ] Success messages display appropriately
- [ ] Loading states show during API calls
- [ ] Forms are keyboard accessible
- [ ] Tab navigation works correctly
- [ ] Forms work on mobile devices
- [ ] Avatar upload UI is intuitive
- [ ] Timezone search is responsive
- [ ] Delete confirmation is prominent
- [ ] Settings persist after logout/login
- [ ] Password change maintains session
- [ ] Account deletion logs out user

## 7. Database Schema

Current schema already supports all required fields:

```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  username String @unique
  passwordHash String
  avatarUrl String?
  timezone String @default("Asia/Seoul")
  locale String @default("ko")
  pushNotificationEnabled Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  // Relations
  habits Habit[]
  habitLogs HabitLog[]
  streaks Streak[]
  notifications Notification[]
  pushSubscriptions PushSubscription[]
}
```

**No schema changes required** - all fields already exist.

## 8. Implementation Phases

### Phase 1: Backend Foundation (30 min)
- Create user.service.ts with all service methods
- Create user.controller.ts with all endpoints
- Create user.routes.ts with route definitions
- Integrate routes into main index.ts
- Test all endpoints with Postman/curl

### Phase 2: Frontend Services (15 min)
- Create lib/users.ts with API client methods
- Create utility helpers for timezones and locales

### Phase 3: Frontend Components (45 min)
- Create settings page layout
- Create ProfileForm component
- Create SettingsForm component
- Create PasswordForm component
- Create AccountDangerZone component

### Phase 4: Integration (15 min)
- Add settings link to navigation
- Wire up all forms to API
- Add error handling and loading states
- Test all flows

### Phase 5: Polish & Testing (15 min)
- Add form validation
- Improve UX with loading states
- Test all scenarios
- Fix bugs

**Total Estimated Time**: 2 hours

## 9. Success Metrics

### Functional Metrics
- All API endpoints return expected responses
- All form validations work correctly
- Password changes maintain session
- Account deletion works and logs out user
- Settings persist across sessions

### User Experience Metrics
- Forms load user data within 500ms
- Form submissions complete within 1s
- Error messages are displayed within 100ms
- Success messages auto-dismiss after 3s
- No console errors in browser

### Security Metrics
- Passwords are never logged or returned
- All endpoints require authentication
- Password changes require current password
- Account deletion requires password + confirmation
- Rate limiting prevents brute force

## 10. Future Enhancements

### Potential Features
- Email verification for email changes
- Two-factor authentication (2FA)
- Social login integration
- Export user data (GDPR compliance)
- Activity log (login history, changes)
- Password recovery via email
- Avatar upload to cloud storage (S3/Cloudinary)
- Theme preferences (dark mode)
- Data export before account deletion
- Account deactivation (temporary)
- Session management (view/revoke devices)

### Internationalization (i18n)
- Full translation of UI text
- Locale-specific date/time formatting
- Right-to-left language support
- Currency preferences for future payment features
