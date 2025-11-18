# 습관 형성 웹 애플리케이션 PRD (Product Requirements Document)

**문서 버전**: 1.0
**작성일**: 2025-11-18
**프로젝트명**: prototype-habit
**상태**: Draft (검토 대기)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목표
사용자가 일상 속에서 새로운 습관을 형성하고, 꾸준하게 유지할 수 있도록 지원하는 웹 기반 습관 추적 애플리케이션 개발

### 1.2 문제 정의
- 사용자들이 습관 형성 의도는 있지만, 지속적으로 추적하고 동기를 유지하기 어려움
- 기존 솔루션들은 과도한 기능으로 복잡하거나, 핵심 추적 기능이 부족함
- 시각적 피드백과 진행도 추적의 필요성 증대

### 1.3 핵심 가치 제안 (Value Proposition)
- **간단함**: 습관 등록과 체크인이 직관적이고 빠름 (5초 이내)
- **가시성**: 연속 달성 일수(Streak)와 시각적 달력으로 진행도 한눈에 파악
- **동기 부여**: 지속적인 성공을 시각화하여 모멘텀 유지
- **자동 알림**: 푸시 알림으로 습관 실행 타이밍 상기

### 1.4 타겟 사용자
- **주요 대상**: 개인 사용자 (Self-tracking)
  - 나이: 20대~40대
  - 운동, 독서, 명상, 공부 등 건강한 습관 형성 목표층
  - 모바일/웹 앱에 익숙한 사용자

### 1.5 개발 방식론
- **MVP 우선 접근**: 핵심 기능에만 집중하여 빠르게 출시
- **반복적 개선**: 사용자 피드백을 바탕으로 점진적 기능 확장

---

## 2. 핵심 기능 명세

### 2.1 습관 추적 & 체크인
**우선순위**: P0 (MVP 필수)

#### 2.1.1 습관 생성/관리
- **기능**: 사용자가 추적할 습관 등록
- **요구사항**:
  - 습관명, 설명, 카테고리 (운동/독서/명상/학습/건강/기타) 입력
  - 빈도 설정:
    - 매일 (Daily)
    - 주간 목표 (주 N회, 예: 주 3회 운동)
    - 특정 요일 (월/수/금 운동)
    - 커스텀 주기 (격주, 매달 등)
  - 습관별 목표값 설정 (예: "30분 운동", "20페이지 독서")
  - 습관 편집/삭제 기능

#### 2.1.2 일일 체크인
- **기능**: 습관 완료 여부를 매일 기록
- **요구사항**:
  - 대시보드에서 오늘의 습관 목록 표시
  - 클릭/터치로 완료 표시 (토글)
  - 완료/미완료 상태의 시각적 피드백 (체크마크, 색상 변화)
  - 습관별 추가 메모 작성 가능 (선택사항)
  - 체크인 시간 자동 기록

#### 2.1.3 과거 기록 수정
- **기능**: 이전 날짜의 체크인 정보 수정 가능
- **요구사항**:
  - 최대 7일 전까지 수정 가능
  - 날짜 선택 후 해당일의 습관 수정

---

### 2.2 리마인더 & 알림
**우선순위**: P1 (MVP 직후)

#### 2.2.1 웹 푸시 알림
- **기능**: 브라우저 푸시 알림으로 사용자에게 습관 실행 상기
- **요구사항**:
  - 사용자가 습관별 알림 시간 설정 가능
  - PWA (Progressive Web App) 방식으로 구현
  - 브라우저 권한 요청 (최초 방문 시)
  - 알림 음성/소리 옵션
  - 알림 끄기/켜기 토글
  - 일회용 습관의 경우, 설정 시간에 1회 알림

#### 2.2.2 알림 히스토리
- **기능**: 전송된 알림 목록 조회
- **요구사항**:
  - 최근 알림 20개 표시
  - 읽음/읽지 않음 상태 표시

---

### 2.3 통계 & 인사이트
**우선순위**: P0 (MVP 필수 - 핵심 시각화)

#### 2.3.1 대시보드
- **기능**: 사용자의 습관 현황을 한눈에 파악
- **요구사항**:
  - 오늘의 완료율 (예: 4/6 습관 완료, 67%)
  - 이번주 완료율
  - 각 습관별 현재 Streak
  - 최장 Streak 기록
  - 가장 많이 완료한 습관 Top 3

#### 2.3.2 시각적 달력 (히트맵)
- **기능**: GitHub 스타일의 연속 달성 표시
- **요구사항**:
  - 최근 12개월 또는 사용자 선택 기간의 달력 표시
  - 완료도에 따라 색상 진하기 변화 (완료 0회 → 연한색, 완료 많음 → 진한색)
  - 마우스 오버 시 해당일의 완료/미완료 습관 목록 표시
  - 습관별 개별 히트맵 지원

#### 2.3.3 통계 차트
- **기능**: 기간별 완료도 시각화
- **요구사항**:
  - 지난 30일 주간 완료율 그래프
  - 습관별 월간 완료도 비교 (막대 그래프)
  - 카테고리별 완료도 분포 (파이 차트)
  - 선택 기간 조정 가능 (1주, 1개월, 3개월, 6개월, 1년)

#### 2.3.4 통계 요약
- **기능**: 정량적 통계 정보 제공
- **요구사항**:
  - 전체 체크인 수
  - 전체 완료율 (%)
  - 가장 많이 실천한 습관
  - 평균 일일 완료율
  - 가장 긴 연속 달성 기록 (모든 습관 통합)

---

### 2.4 보상 시스템
**우선순위**: P1 (동기 부여)

#### 2.4.1 Streak (연속 달성 일수)
- **기능**: 습관을 연속으로 완료한 일수 추적
- **요구사항**:
  - 일일 체크인으로 Streak 증가
  - 하루 미완료 시 Streak 초기화 (0으로 리셋)
  - 습관별 현재 Streak과 최장 Streak 기록
  - 새로운 최장 기록 달성 시 알림/축하 메시지

#### 2.4.2 시각적 달력 표시
- **기능**: 연속 달성을 시각적으로 표현 (위의 2.3.2 섹션 참조)
- **요구사항**:
  - 녹색(완료)/회색(미완료)으로 구분
  - 연속된 녹색 블록으로 심리적 만족감 유도

---

## 3. 기술 스택 권장안

### 3.1 아키텍처
```
Frontend (웹 브라우저)
    ↓ (HTTP/WebSocket)
Backend API 서버
    ↓ (SQL 쿼리)
데이터베이스
```

### 3.2 프론트엔드

**옵션 1: React 기반 (권장)**
- **Framework**: Next.js 13+ (App Router)
- **장점**: SSR 지원, 배포 용이, 큰 커뮤니티
- **언어**: TypeScript
- **UI 라이브러리**: shadcn/ui, Tailwind CSS
- **상태관리**: TanStack Query (데이터 페칭), Zustand (전역 상태)
- **차트**: Recharts, Chart.js
- **PWA**: next-pwa

**옵션 2: Vue 기반**
- **Framework**: Nuxt 3
- **UI**: Vuetify 또는 shadcn-vue
- **상태관리**: Pinia

### 3.3 백엔드

**옵션 1: Node.js (권장)**
- **Framework**: Express.js 또는 NestJS
- **언어**: TypeScript
- **데이터베이스 ORM**: Prisma
- **검증**: Zod
- **인증**: jsonwebtoken (JWT)
- **푸시 알림**: web-push

**옵션 2: Python**
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **인증**: python-jose
- **푸시 알림**: pywebpush

**옵션 3: Java**
- **Framework**: Spring Boot 3.x
- **ORM**: JPA/Hibernate
- **Build**: Gradle
- **인증**: Spring Security + JWT

### 3.4 데이터베이스

**주데이터베이스**: PostgreSQL 15+
- 트랜잭션 지원
- JSONB 타입 활용 가능
- 확장성 우수

**캐싱**: Redis
- 세션 저장
- 자주 조회되는 Streak, 통계 캐싱
- 알림 큐

### 3.5 인증
- **방식**: JWT (Bearer Token)
- **저장**: HttpOnly Cookie (XSS 방지) 또는 LocalStorage
- **갱신**: Refresh Token 방식

### 3.6 웹 푸시 알림
- **표준**: Web Push Protocol (RFC 8030)
- **서비스**: VAPID 프로토콜 사용
- **라이브러리**: web-push (Node.js), pywebpush (Python)

### 3.7 배포

**프론트엔드**:
- Vercel (Next.js 최적화), Netlify, GitHub Pages, 또는 클라우드 호스팅 (AWS S3 + CloudFront, GCP Storage)

**백엔드**:
- Heroku (간단함), Railway, Render, AWS EC2/ECS, GCP Cloud Run, 또는 Docker + Kubernetes

**데이터베이스**:
- Managed Services: AWS RDS, GCP Cloud SQL, Supabase, Neon (Serverless PostgreSQL)

---

## 4. 데이터베이스 스키마

### 4.1 ER Diagram (개요)

```
Users (1) ──────────── (N) Habits
   │                        │
   │                        ├─── (N) HabitLogs
   │                        │
   │                        └─── (N) Streaks
   │
   └─── (N) Notifications
```

### 4.2 테이블 명세

#### Users 테이블
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'Asia/Seoul',
    locale VARCHAR(10) DEFAULT 'ko',
    push_notification_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);
```

#### Habits 테이블
```sql
CREATE TABLE habits (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'other', -- 운동, 독서, 명상, 학습, 건강, 기타
    frequency_type VARCHAR(50) NOT NULL, -- daily, weekly, custom
    frequency_detail JSONB, -- {"days": [1,3,5]} or {"interval": 2}
    target_value VARCHAR(100), -- "30분", "20페이지" 등
    reminder_enabled BOOLEAN DEFAULT true,
    reminder_time TIME, -- HH:MM 형식
    color_hex VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
);
```

#### HabitLogs 테이블
```sql
CREATE TABLE habit_logs (
    id BIGSERIAL PRIMARY KEY,
    habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    logged_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    notes TEXT,
    completed_at TIMESTAMP, -- 실제 완료 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_habit FOREIGN KEY (habit_id) REFERENCES habits(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (habit_id, logged_date),
    INDEX idx_user_logged_date (user_id, logged_date),
    INDEX idx_habit_logged_date (habit_id, logged_date)
);
```

#### Streaks 테이블
```sql
CREATE TABLE streaks (
    id BIGSERIAL PRIMARY KEY,
    habit_id BIGINT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_completed_date DATE,
    streak_started_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_habit FOREIGN KEY (habit_id) REFERENCES habits(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (habit_id),
    INDEX idx_habit_id (habit_id)
);
```

#### Notifications 테이블
```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    habit_id BIGINT REFERENCES habits(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- reminder, streak, achievement
    title VARCHAR(255) NOT NULL,
    body TEXT,
    is_read BOOLEAN DEFAULT false,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_scheduled (scheduled_at)
);
```

#### PushSubscriptions 테이블 (PWA용)
```sql
CREATE TABLE push_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    endpoint VARCHAR(500) NOT NULL,
    auth_key VARCHAR(255) NOT NULL,
    p256dh_key VARCHAR(255) NOT NULL,
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (user_id, endpoint),
    INDEX idx_user_id (user_id)
);
```

---

## 5. API 명세

### 5.1 인증 (Authentication)

#### 회원가입
```
POST /api/auth/register
Content-Type: application/json

{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "SecurePassword123!"
}

응답 (201):
{
    "user": {
        "id": "123",
        "email": "user@example.com",
        "username": "johndoe",
        "created_at": "2025-11-18T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 로그인
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "SecurePassword123!"
}

응답 (200):
{
    "user": {...},
    "token": "eyJ...",
    "refreshToken": "eyJ..."
}
```

#### 토큰 갱신
```
POST /api/auth/refresh
Authorization: Bearer <refreshToken>

응답 (200):
{
    "token": "eyJ...",
    "refreshToken": "eyJ..."
}
```

### 5.2 습관 (Habits)

#### 습관 목록 조회
```
GET /api/habits
Authorization: Bearer <token>

응답 (200):
{
    "data": [
        {
            "id": "1",
            "name": "아침 운동",
            "description": "매일 아침 30분 운동",
            "category": "운동",
            "frequency_type": "daily",
            "frequency_detail": {},
            "target_value": "30분",
            "reminder_enabled": true,
            "reminder_time": "06:00",
            "is_active": true,
            "created_at": "2025-11-10T00:00:00Z"
        }
    ],
    "count": 1
}
```

#### 습관 생성
```
POST /api/habits
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "책 읽기",
    "description": "매일 20페이지 이상",
    "category": "독서",
    "frequency_type": "daily",
    "frequency_detail": {},
    "target_value": "20페이지",
    "reminder_enabled": true,
    "reminder_time": "20:00"
}

응답 (201):
{
    "data": {
        "id": "2",
        "name": "책 읽기",
        ...
    }
}
```

#### 습관 수정
```
PUT /api/habits/{habitId}
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "책 읽기 (업데이트됨)",
    "reminder_time": "21:00"
}

응답 (200): {...}
```

#### 습관 삭제
```
DELETE /api/habits/{habitId}
Authorization: Bearer <token>

응답 (204): No Content
```

### 5.3 습관 로그 (Habit Logs)

#### 체크인 (완료 표시)
```
POST /api/habits/{habitId}/logs
Authorization: Bearer <token>
Content-Type: application/json

{
    "logged_date": "2025-11-18",
    "is_completed": true,
    "notes": "30분 조깅 완료"
}

응답 (201):
{
    "data": {
        "id": "log123",
        "habit_id": "1",
        "logged_date": "2025-11-18",
        "is_completed": true,
        "completed_at": "2025-11-18T06:30:00Z",
        "notes": "30분 조깅 완료"
    }
}
```

#### 특정 날짜 로그 조회
```
GET /api/habits/{habitId}/logs?start_date=2025-11-01&end_date=2025-11-30
Authorization: Bearer <token>

응답 (200):
{
    "data": [
        {
            "id": "log123",
            "logged_date": "2025-11-18",
            "is_completed": true,
            "notes": "..."
        }
    ],
    "count": 30
}
```

#### 로그 수정
```
PUT /api/habits/{habitId}/logs/{logId}
Authorization: Bearer <token>
Content-Type: application/json

{
    "is_completed": false,
    "notes": "updated note"
}

응답 (200): {...}
```

### 5.4 대시보드 (Dashboard)

#### 오늘의 요약
```
GET /api/dashboard/today
Authorization: Bearer <token>

응답 (200):
{
    "data": {
        "today_date": "2025-11-18",
        "total_habits": 6,
        "completed_habits": 4,
        "completion_rate": 0.667,
        "habits": [
            {
                "id": "1",
                "name": "아침 운동",
                "is_completed": true,
                "current_streak": 12
            }
        ]
    }
}
```

#### 통계 조회
```
GET /api/dashboard/stats?period=month
Authorization: Bearer <token>

응답 (200):
{
    "data": {
        "total_completions": 120,
        "overall_completion_rate": 0.85,
        "most_completed_habit": "아침 운동",
        "longest_streak": 30,
        "habit_streaks": [
            {
                "habit_id": "1",
                "habit_name": "아침 운동",
                "current_streak": 12,
                "longest_streak": 30
            }
        ]
    }
}
```

### 5.5 리마인더 & 알림 (Notifications)

#### 알림 목록
```
GET /api/notifications?limit=20&offset=0
Authorization: Bearer <token>

응답 (200):
{
    "data": [
        {
            "id": "notif123",
            "type": "reminder",
            "title": "아침 운동 시간입니다!",
            "body": "매일 아침 운동 습관을 실천할 시간이에요.",
            "is_read": false,
            "sent_at": "2025-11-18T06:00:00Z"
        }
    ],
    "count": 20,
    "total": 150
}
```

#### 알림 읽음 표시
```
PATCH /api/notifications/{notificationId}/read
Authorization: Bearer <token>

응답 (200): {...}
```

#### 웹 푸시 구독 등록
```
POST /api/notifications/push-subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
    "subscription": {
        "endpoint": "https://fcm.googleapis.com/fcm/send/...",
        "keys": {
            "auth": "...",
            "p256dh": "..."
        }
    }
}

응답 (201): {...}
```

---

## 6. UI/UX 요구사항

### 6.1 주요 화면

#### 1. 대시보드 (Dashboard)
**목적**: 사용자의 오늘의 습관 현황과 통계를 한눈에 파악

**필수 요소**:
- 헤더: 오늘 날짜, 사용자명/로그아웃
- 완료율 표시: 원형 진행 그래프 (4/6 완료 등)
- 습관 목록:
  - 습관명, 목표값, 완료 여부 (체크박스)
  - 현재 Streak 표시
  - 클릭으로 토글 가능
- 사이드바/탭:
  - 대시보드, 통계, 습관 관리, 설정

**반응형**: 모바일-우선 설계, 태블릿/데스크톱 지원

#### 2. 통계 (Statistics)
**목적**: 사용자의 습관 실천 현황을 다각도로 분석

**필수 요소**:
- 기간 선택 (1주, 1개월, 3개월, 6개월, 1년)
- 히트맵: 최근 12개월 달력 (GitHub 스타일)
- 차트:
  - 주간 완료율 (라인 차트)
  - 습관별 비교 (막대 그래프)
  - 카테고리 분포 (파이 차트)
- 통계 요약:
  - 전체 완료율
  - 총 체크인 수
  - 최장 Streak
  - 가장 완료도 높은 습관

#### 3. 습관 관리 (Habit Management)
**목적**: 습관 생성, 편집, 삭제

**필수 요소**:
- 습관 목록: 활성/비활성 필터
- 습관별 카드: 이름, 빈도, 리마인더 시간, 활성화 토글
- "새로운 습관" 버튼
- 습관 상세 수정 폼:
  - 이름, 설명, 카테고리
  - 빈도 설정 (Daily/Weekly/Custom)
  - 목표값, 리마인더 시간
  - 저장/취소/삭제

#### 4. 설정 (Settings)
**목적**: 사용자 설정 및 계정 관리

**필수 요소**:
- 프로필: 사용자명, 이메일, 아바타 변경
- 알림: 푸시 알림 전체 활성화/비활성화
- 시간대 (Timezone) 설정
- 언어 설정 (한글/English)
- 비밀번호 변경
- 계정 삭제
- 로그아웃

### 6.2 사용자 플로우

#### 새 사용자 온보딩
```
1. 회원가입 페이지
   ↓
2. 이메일 인증 (선택사항)
   ↓
3. 첫 습관 생성 가이드
   ↓
4. 리마인더 권한 요청 (PWA)
   ↓
5. 대시보드로 이동
```

#### 일일 습관 체크인
```
1. 대시보드 열기
   ↓
2. 완료한 습관 체크박스 클릭
   ↓
3. 완료 상태 저장 (자동)
   ↓
4. 시각적 피드백 (체크마크, 색상 변화)
```

#### 통계 확인
```
1. "통계" 탭 클릭
   ↓
2. 기간 선택 (기본: 지난 1개월)
   ↓
3. 히트맵, 차트, 요약 정보 확인
```

### 6.3 디자인 원칙
- **직관성**: 3초 내 오늘의 습관 확인 가능
- **친화성**: 색상, 아이콘으로 상태 명확히 표시
- **반응성**: 클릭/터치 후 100ms 이내 피드백
- **접근성**: WCAG 2.1 AA 표준 준수

---

## 7. 개발 로드맵 (MVP 기준)

### Phase 1: MVP (3~4주)
**목표**: 습관 추적의 핵심 기능 구현

**구현 항목**:
- [ ] 프로젝트 초기화 (폴더 구조, 설정)
- [ ] 백엔드: 데이터베이스 스키마 생성
- [ ] 백엔드: 사용자 인증 (회원가입, 로그인, JWT)
- [ ] 백엔드: 습관 CRUD API
- [ ] 백엔드: 습관 로그 (체크인) API
- [ ] 프론트엔드: 회원가입/로그인 페이지
- [ ] 프론트엔드: 대시보드 (오늘의 습관 + 체크인)
- [ ] 프론트엔드: 습관 관리 페이지
- [ ] 백엔드: Streak 자동 계산 로직
- [ ] 배포: 개발 환경 서버/데이터베이스 구성
- [ ] 테스트: 기본 유닛 테스트

**완료 조건**:
- 사용자가 습관을 생성하고 매일 체크인 가능
- Streak 자동 업데이트
- 모바일/웹 기본 대응

---

### Phase 2: 통계 & 시각화 (2~3주)
**목표**: 시각적 피드백과 동기 부여 기능

**구현 항목**:
- [ ] 백엔드: 통계 API (완료율, 최장 Streak 등)
- [ ] 프론트엔드: 통계 페이지
  - [ ] 히트맵 (calendar heatmap 라이브러리)
  - [ ] 주간/월간 차트 (Recharts)
  - [ ] 습관별 비교 그래프
  - [ ] 통계 요약 섹션
- [ ] 백엔드: 데이터 캐싱 (Redis)
- [ ] 프론트엔드: 대시보드 개선 (Streak 강조)

**완료 조건**:
- 통계 페이지에서 최소 3가지 이상의 시각화 제공
- 성능: 통계 로드 시간 < 2초

---

### Phase 3: 알림 & 고도화 (2~3주)
**목표**: 자동 리마인더와 사용자 경험 최적화

**구현 항목**:
- [ ] 백엔드: Web Push API 통합
- [ ] 백엔드: 푸시 알림 스케줄링 (크론 작업)
- [ ] 프론트엔드: PWA 설정 (manifest.json, service worker)
- [ ] 프론트엔드: 푸시 권한 요청 및 구독
- [ ] 프론트엔드: 알림 목록 페이지
- [ ] 백엔드: Streak 달성 축하 알림
- [ ] 프론트엔드: 과거 로그 수정 기능
- [ ] 프론트엔드: 설정 페이지 (시간대, 언어, 알림 설정)

**완료 조건**:
- 알림이 정해진 시간에 정확히 전송
- PWA로 설치 가능 (모바일 앱처럼 사용)
- 과거 7일 내 로그 수정 가능

---

### Phase 4: 폴리시 & 배포 (1~2주)
**목표**: 프로덕션 배포 준비

**구현 항목**:
- [ ] 보안: HTTPS, CORS, Rate Limiting
- [ ] 보안: 입력 검증, SQL Injection 방지
- [ ] 성능: API 응답 최적화, 캐싱 전략
- [ ] 로깅: 에러 로깅, 사용자 활동 로깅
- [ ] 모니터링: 백엔드 모니터링 (Sentry, New Relic)
- [ ] 도큐먼트: API 문서 (Swagger)
- [ ] 배포: CI/CD 파이프라인 설정
- [ ] 배포: 프로덕션 환경 구성
- [ ] 테스트: E2E 테스트, 성능 테스트
- [ ] 릴리스: 베타 사용자 피드백 수집

**완료 조건**:
- 프로덕션 배포 (모든 기능 정상 작동)
- 99% 이상 가용성

---

## 8. 테스트 전략

### 8.1 단위 테스트 (Unit Tests)
- **대상**: 백엔드 비즈니스 로직
  - Streak 계산 함수
  - 완료율 계산
  - 빈도 유효성 검사
- **프레임워크**: Jest (Node.js), Pytest (Python)
- **커버리지 목표**: 80% 이상

### 8.2 통합 테스트 (Integration Tests)
- **대상**: API 엔드포인트
  - 습관 CRUD
  - 체크인 로직
  - 사용자 인증
- **프레임워크**: Jest, Supertest (Node.js), PyTest (Python)

### 8.3 E2E 테스트 (End-to-End Tests)
- **시나리오**:
  - 회원가입 → 습관 생성 → 체크인 → 통계 확인
  - 알림 구독 → 알림 수신
  - 과거 로그 수정
- **프레임워크**: Cypress, Playwright
- **브라우저**: Chrome, Firefox, Safari

### 8.4 성능 테스트
- **목표**:
  - API 응답 시간: < 200ms (p95)
  - 페이지 로드: < 3초
  - 동시 사용자 100명 처리 가능
- **도구**: k6, JMeter, Lighthouse

---

## 9. 배포 전략

### 9.1 개발 환경
- **Backend**: localhost:3000 (또는 별도 포트)
- **Frontend**: localhost:3001
- **Database**: Docker Postgres
- **시작**: `npm run dev` / `docker-compose up`

### 9.2 스테이징 환경
- **목적**: 프로덕션과 동일한 환경에서 테스트
- **배포 대상**: Heroku, Railway 등 클라우드 플랫폼
- **Database**: Managed PostgreSQL (Supabase, Neon)
- **CI/CD**: GitHub Actions (자동 배포)

### 9.3 프로덕션 환경
- **Backend**: Vercel, AWS EC2, GCP Cloud Run
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS / GCP Cloud SQL / Supabase
- **CDN**: CloudFlare
- **모니터링**: Sentry (에러), DataDog (성능)

### 9.4 CI/CD 파이프라인
```
GitHub Push
    ↓
GitHub Actions 트리거
    ↓
린트 & 포맷 검사
    ↓
유닛/통합 테스트
    ↓
빌드
    ↓
E2E 테스트 (선택사항)
    ↓
배포 (자동)
    ↓
헬스 체크 & 모니터링
```

---

## 10. 성공 지표 (Success Metrics)

### 10.1 기능 측면
- [ ] MVP의 모든 기능 정상 작동 (100%)
- [ ] 버그 신고 0건 (프로덕션 1주)
- [ ] API 응답 시간 200ms 이하 (p95)
- [ ] 모바일/태블릿/데스크톱 모두 정상 작동

### 10.2 사용자 경험
- [ ] 초신규 사용자의 첫 습관 생성 < 1분
- [ ] 일일 체크인 < 5초
- [ ] 사용자 만족도 4/5 이상 (설문)

### 10.3 운영 측면
- [ ] 가용성: 99% 이상
- [ ] 데이터 백업: 일 1회 이상
- [ ] 보안: 취약점 스캔 정기 실시

---

## 11. 향후 확장 기능 (Phase 4+)

### 우선순위 높음
- 소셜 기능 (친구 추가, 습관 공유, 리더보드)
- 모바일 앱 (React Native, Flutter)
- 고급 통계 (AI 기반 인사이트)
- 알림 채널 확장 (이메일, SMS, Slack)

### 우선순위 중간
- 습관 템플릿 라이브러리
- 커뮤니티 챌린지
- 데이터 내보내기 (CSV, PDF)
- 어두운 모드 (Dark Mode)

### 우선순위 낮음
- 위젯 (홈 화면 위젯)
- 클라우드 동기화 (iCloud, Google Drive)
- 음성 명령어

---

## 12. 위험 요소 및 대응

| 위험 | 영향 | 확률 | 대응 방안 |
|------|------|------|---------|
| 요구사항 변경 | 일정 지연 | 높음 | 정기 리뷰, 변경 관리 프로세스 |
| 데이터 손실 | 사용자 데이터 손실 | 낮음 | 백업 전략, 재해 복구 계획 |
| 보안 취약점 | 사용자 계정 침해 | 중간 | 정기 보안 감사, 의존성 업데이트 |
| 성능 저하 | 사용자 이탈 | 중간 | 캐싱, 데이터베이스 최적화, 모니터링 |
| 푸시 알림 미전송 | 기능 실패 | 낮음 | 재전송 로직, 명확한 에러 처리 |

---

## 13. 참고 자료

### 3rd Party API & 라이브러리
- **Web Push**: web-push, pywebpush
- **차트**: Recharts, Chart.js, D3.js
- **달력 히트맵**: react-calendar-heatmap, gh-calendar
- **인증**: Auth0, Firebase Authentication
- **데이터베이스**: Prisma, SQLAlchemy, Sequelize

### 벤치마크 (경쟁 앱 분석)
- Habitica: 게임화 강조
- Done: 심플함
- Loop: 시각적 달력 강조
- **우리의 차별점**: 간단함 + 시각적 피드백 + 푸시 알림의 최적 조합

---

## 부록 A: 용어 정의

| 용어 | 정의 |
|-----|------|
| **Habit** | 사용자가 추적하고자 하는 반복적인 행동 |
| **Streak** | 습관을 연속으로 완료한 일수 |
| **Check-in** | 특정 날짜에 습관을 완료했음을 기록하는 행위 |
| **Completion Rate** | 기간 내 완료한 습관 수 / 예정된 습관 수 |
| **Heatmap** | 시간별 또는 날짜별 활동 강도를 색상으로 표현한 시각화 |
| **MVP** | Minimum Viable Product (최소 기능 제품) |
| **PWA** | Progressive Web App (앱처럼 동작하는 웹 애플리케이션) |

---

## 부록 B: 개발 환경 체크리스트

- [ ] Node.js 18+ / Python 3.10+ 설치
- [ ] Git 설정
- [ ] IDE 설정 (VS Code, WebStorm 등)
- [ ] Docker 설정 (선택사항)
- [ ] 데이터베이스 클라이언트 (pgAdmin, DBeaver)
- [ ] Postman/Insomnia (API 테스트)
- [ ] 프로젝트 폴더 구조 생성
- [ ] 팀 커뮤니케이션 채널 (Slack, Discord)

---

**문서 작성**: 2025-11-18
**최종 검토 예정일**: [사용자 검토 후 결정]
**다음 단계**: 팀 검토 및 승인 → Phase 1 개발 시작

