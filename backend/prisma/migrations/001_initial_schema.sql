-- CreateTable users
CREATE TABLE "users" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "username" VARCHAR(100) NOT NULL UNIQUE,
    "passwordHash" VARCHAR(255) NOT NULL,
    "avatarUrl" VARCHAR(500),
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'Asia/Seoul',
    "locale" VARCHAR(10) NOT NULL DEFAULT 'ko',
    "pushNotificationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP
);

-- CreateTable habits
CREATE TABLE "habits" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50) NOT NULL DEFAULT '기타',
    "frequencyType" VARCHAR(50) NOT NULL,
    "frequencyDetail" JSONB,
    "targetValue" VARCHAR(100),
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reminderTime" VARCHAR(5),
    "colorHex" VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,
    CONSTRAINT "habits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE INDEX "habits_userId_idx" ON "habits" ("userId");

-- CreateTable habit_logs
CREATE TABLE "habit_logs" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "habitId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "loggedDate" DATE NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "completedAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "habit_logs_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE CASCADE,
    CONSTRAINT "habit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "habit_logs_habitId_loggedDate_key" UNIQUE ("habitId", "loggedDate")
);

CREATE INDEX "habit_logs_userId_loggedDate_idx" ON "habit_logs" ("userId", "loggedDate");
CREATE INDEX "habit_logs_habitId_loggedDate_idx" ON "habit_logs" ("habitId", "loggedDate");

-- CreateTable streaks
CREATE TABLE "streaks" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "habitId" INTEGER NOT NULL UNIQUE,
    "userId" INTEGER NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastCompletedDate" DATE,
    "streakStartedDate" DATE,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "streaks_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE CASCADE,
    CONSTRAINT "streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE INDEX "streaks_habitId_idx" ON "streaks" ("habitId");

-- CreateTable notifications
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "habitId" INTEGER,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "body" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP,
    "sentAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "notifications_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "habits" ("id") ON DELETE SET NULL
);

CREATE INDEX "notifications_userId_createdAt_idx" ON "notifications" ("userId" DESC, "createdAt" DESC);
CREATE INDEX "notifications_scheduledAt_idx" ON "notifications" ("scheduledAt");

-- CreateTable push_subscriptions
CREATE TABLE "push_subscriptions" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "endpoint" VARCHAR(500) NOT NULL,
    "authKey" VARCHAR(255) NOT NULL,
    "p256dhKey" VARCHAR(255) NOT NULL,
    "userAgent" VARCHAR(500),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "push_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
    CONSTRAINT "push_subscriptions_userId_endpoint_key" UNIQUE ("userId", "endpoint")
);

CREATE INDEX "push_subscriptions_userId_idx" ON "push_subscriptions" ("userId");
