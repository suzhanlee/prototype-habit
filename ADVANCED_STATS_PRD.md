# Advanced Statistics & Analytics System - Product Requirements Document (PRD)

## 1. Feature Overview

The Advanced Statistics & Analytics System provides comprehensive data analysis and visualization capabilities for habit tracking. This feature goes beyond basic completion tracking to offer deep insights, predictive analytics, and actionable recommendations to help users understand their habits better and improve consistency.

### Goals
- Provide comprehensive analytics across multiple dimensions (time, category, habit comparison)
- Offer actionable insights and recommendations based on user data
- Visualize complex data patterns through interactive charts
- Enable data-driven decision making for habit improvement
- Support performance analysis over various time periods

### Key Benefits
- **Data-Driven Insights**: Understand habit patterns and performance trends
- **Personalized Recommendations**: Get specific suggestions based on behavior
- **Motivation**: Visual progress tracking encourages consistency
- **Performance Optimization**: Identify best and weak performing habits
- **Pattern Recognition**: Discover optimal completion times and patterns

---

## 2. User Stories

### As a user, I want to:

1. **View Category Distribution**
   - See which habit categories I focus on most
   - Understand time allocation across different habit types
   - Identify over/under-represented categories

2. **Compare Habit Performance**
   - See which habits I'm most consistent with
   - Identify habits that need more attention
   - Compare completion rates across all habits

3. **Track Monthly Trends**
   - Understand how my consistency changes over time
   - See long-term progress patterns
   - Identify seasonal or periodic variations

4. **Recognize Top Performing Habits**
   - Celebrate my most successful habits
   - Understand what makes certain habits stick
   - Use successful patterns for other habits

5. **Identify Weak Habits**
   - Find habits I'm neglecting
   - Get reminders about habits needing attention
   - Receive suggestions for improvement

6. **View Completion Patterns**
   - See heatmap of completion by day/time
   - Identify best days for habit completion
   - Understand weekly patterns

7. **Analyze Time-Based Behavior**
   - Discover optimal completion times
   - See hour-by-hour completion patterns
   - Plan habits around peak performance times

8. **Track Consistency Score**
   - Get overall consistency metric (0-100)
   - Understand trend direction (improving/declining)
   - Receive personalized feedback

9. **Review Streak Analytics**
   - See all current streaks at a glance
   - Track longest streaks achieved
   - Monitor average streak performance

10. **Receive Predictive Insights**
    - Get warned about habits likely to break
    - Receive focus recommendations
    - Get optimal timing suggestions
    - View personalized improvement tips

11. **Export Analytics Data**
    - Download data as CSV or JSON
    - Share progress with others
    - Backup analytics for external analysis

---

## 3. Advanced Analytics Specifications

### 3.1 Category Distribution Analysis
**Purpose**: Show habit completion breakdown by category

**Metrics**:
- Total completions per category
- Percentage of total completions
- Category color coding
- Active habits per category

**Calculation**:
```
For each category:
  - Count completed logs in date range
  - Calculate percentage of total
  - Aggregate by category
```

**Use Cases**:
- Understanding focus areas
- Balancing habit categories
- Resource allocation planning

---

### 3.2 Habit Comparison
**Purpose**: Compare performance across all habits

**Metrics**:
- Completion rate (percentage)
- Total days tracked
- Current streak
- Longest streak

**Calculation**:
```
For each habit:
  - Count completed days / total days in period
  - Get current streak value
  - Sort by completion rate
```

**Use Cases**:
- Identifying best/worst performers
- Making informed decisions about habit adjustments
- Celebrating achievements

---

### 3.3 Monthly Trend Analysis
**Purpose**: Show completion trends over time

**Metrics**:
- Monthly completion rate
- Total completions per month
- Active habit count per month
- Trend direction

**Calculation**:
```
For each month:
  - Count total completions
  - Count total expected completions
  - Calculate completion rate
  - Determine trend (up/down/stable)
```

**Use Cases**:
- Long-term progress tracking
- Identifying improvement/decline periods
- Setting realistic goals

---

### 3.4 Top & Weak Habits
**Purpose**: Highlight best and worst performing habits

**Top Habits Criteria**:
- High completion rate (>80%)
- Long current streak (>7 days)
- Consistent performance

**Weak Habits Criteria**:
- Low completion rate (<50%)
- Short/broken streak
- Days since last completion

**Use Cases**:
- Motivation through success recognition
- Early intervention for struggling habits
- Learning from successful patterns

---

### 3.5 Completion Pattern (Heatmap)
**Purpose**: Visual representation of completion frequency

**Metrics**:
- Completions per day
- Day of week patterns
- Week number grouping
- Intensity levels (0-5)

**Visualization**:
- GitHub-style contribution heatmap
- Color intensity based on completion count
- Tooltip with details

**Use Cases**:
- Identifying best/worst days
- Weekly pattern recognition
- Visual motivation

---

### 3.6 Time-Based Analytics
**Purpose**: Analyze completion patterns by time of day

**Metrics**:
- Completions per hour (0-23)
- Most productive time slots
- Peak performance hours
- Habit count by time

**Use Cases**:
- Optimal scheduling
- Energy pattern recognition
- Reminder timing optimization

---

### 3.7 Consistency Score
**Purpose**: Single metric representing overall consistency

**Score Calculation** (0-100):
```
Factors:
- Completion rate (40%)
- Streak consistency (30%)
- Active days ratio (20%)
- Recent performance (10%)

Score = weighted sum of factors
```

**Trend Indicators**:
- Up: Improving (>5% increase)
- Down: Declining (>5% decrease)
- Neutral: Stable (±5%)

**Use Cases**:
- Quick performance overview
- Progress tracking over time
- Gamification element

---

### 3.8 Streak Analytics
**Purpose**: Comprehensive streak information

**Metrics**:
- All current streaks
- All-time longest streaks
- Average streak length
- Streak milestones (7, 30, 90, 365 days)

**Use Cases**:
- Celebrating achievements
- Motivation maintenance
- Competitive tracking

---

### 3.9 Predictive Insights
**Purpose**: AI-like recommendations and predictions

**Insights Types**:
1. **At-Risk Habits**: Habits likely to break (streak >7, missed yesterday)
2. **Focus Recommendations**: Habits needing immediate attention
3. **Optimal Time Suggestions**: Best times based on historical data
4. **Improvement Tips**: Personalized recommendations

**Logic**:
```
At-Risk Detection:
- Current streak > 7 days
- No completion yesterday
- Historical pattern suggests decline

Focus Recommendations:
- Completion rate < 50%
- Days since last completion > 3
- Previously consistent but declining

Optimal Time:
- Most frequent completion hour
- Highest success rate time window
- Consideration of user timezone
```

**Use Cases**:
- Proactive habit maintenance
- Personalized coaching
- Data-driven scheduling

---

## 4. Chart Specifications

### 4.1 Category Chart (Pie Chart)
**Library**: Recharts PieChart

**Data Format**:
```typescript
{
  category: string,
  completionCount: number,
  percentage: number,
  color: string
}[]
```

**Features**:
- Interactive legend (toggle categories)
- Percentage labels inside pie
- Hover tooltips with details
- Color-coded by category
- Center text showing total completions

**Responsive**: Adapts to mobile screens

---

### 4.2 Habit Comparison Chart (Horizontal Bar Chart)
**Library**: Recharts BarChart

**Data Format**:
```typescript
{
  habitName: string,
  completionRate: number,
  totalDays: number,
  currentStreak: number
}[]
```

**Features**:
- Sorted by completion rate (descending)
- Color-coded bars (green >80%, yellow 50-80%, red <50%)
- Labels showing exact percentage
- Max 10 habits visible (scrollable/paginated)
- Hover for additional details

**Responsive**: Stacks on mobile

---

### 4.3 Monthly Trend Chart (Line/Area Chart)
**Library**: Recharts LineChart with AreaChart overlay

**Data Format**:
```typescript
{
  month: string, // 'YYYY-MM'
  completionRate: number,
  totalCompletions: number,
  habitCount: number
}[]
```

**Features**:
- Smooth curve interpolation
- Dual Y-axis (rate and count)
- Gradient area fill
- Date range selector
- Trend line
- Grid lines for readability

**Responsive**: Adjusts points and labels on mobile

---

### 4.4 Time Heatmap (Custom Component)
**Implementation**: Custom grid with Recharts support

**Data Format**:
```typescript
{
  date: string, // 'YYYY-MM-DD'
  count: number,
  dayOfWeek: number,
  weekNumber: number
}[]
```

**Features**:
- 52 weeks x 7 days grid
- Color intensity (0-5 levels)
- Tooltip on hover
- Month labels
- Legend for intensity

**Colors**:
- Level 0: #ebedf0 (none)
- Level 1: #9be9a8 (low)
- Level 2: #40c463 (medium)
- Level 3: #30a14e (high)
- Level 4: #216e39 (very high)

---

### 4.5 Top Habits Card (List Component)
**Format**: Ranked list with badges

**Data Display**:
```
🥇 Habit Name
   95% completion | 45 day streak | 🔥
```

**Features**:
- Top 5 habits
- Medal icons (🥇🥈🥉)
- Streak flame icons for 7+ days
- Star icons for perfect weeks
- Quick action to view details

---

### 4.6 Weak Habits Card (Alert List)
**Format**: Warning-style list

**Data Display**:
```
⚠️ Habit Name
   35% completion | Last completed 5 days ago
   [Resume Now]
```

**Features**:
- Warning icons
- Days without completion
- Quick action buttons
- Suggestions for each habit

---

### 4.7 Consistency Meter (Circular Progress)
**Implementation**: SVG circular progress bar

**Data Display**:
```
      [85]
   Excellent!
     ↑ +5%
```

**Features**:
- 0-100 score
- Color-coded (green >75, yellow 50-75, red <50)
- Trend indicator (↑↓→)
- Text interpretation
- Animation on load

---

### 4.8 Insights Panel (Card Grid)
**Format**: Alert/Info cards

**Card Types**:
1. **Warning**: At-risk habits
2. **Info**: Recommendations
3. **Success**: Achievements
4. **Tip**: Improvement suggestions

**Features**:
- Icon for each type
- Clear actionable text
- Optional CTA button
- Dismissible (optional)

---

## 5. API Specifications

### Base URL: `/api/analytics`

All endpoints require authentication via JWT token in Authorization header.

---

### 5.1 GET `/api/analytics/categories`
**Description**: Get habit completion distribution by category

**Query Parameters**:
- `startDate` (optional): ISO date string (default: 30 days ago)
- `endDate` (optional): ISO date string (default: today)

**Response**:
```json
{
  "data": [
    {
      "category": "운동",
      "completionCount": 45,
      "percentage": 35.7,
      "color": "#3B82F6"
    }
  ],
  "total": 126,
  "period": {
    "startDate": "2024-10-18",
    "endDate": "2024-11-18"
  }
}
```

**Status Codes**:
- 200: Success
- 400: Invalid date range
- 401: Unauthorized

---

### 5.2 GET `/api/analytics/comparison`
**Description**: Compare performance across all habits

**Query Parameters**:
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `limit` (optional): Number of habits to return (default: 10)

**Response**:
```json
{
  "data": [
    {
      "habitId": 1,
      "habitName": "Morning Run",
      "completionRate": 85.5,
      "totalDays": 30,
      "completedDays": 26,
      "currentStreak": 7,
      "longestStreak": 14
    }
  ]
}
```

---

### 5.3 GET `/api/analytics/trends/monthly`
**Description**: Get monthly completion trends

**Query Parameters**:
- `months` (optional): Number of months to retrieve (default: 12, max: 24)

**Response**:
```json
{
  "data": [
    {
      "month": "2024-11",
      "completionRate": 78.5,
      "totalCompletions": 156,
      "habitCount": 8,
      "trend": "up"
    }
  ]
}
```

---

### 5.4 GET `/api/analytics/habits/top`
**Description**: Get top performing habits

**Query Parameters**:
- `limit` (optional): Number of habits (default: 5, max: 10)
- `days` (optional): Period in days (default: 30)

**Response**:
```json
{
  "data": [
    {
      "habitId": 1,
      "habitName": "Meditation",
      "currentStreak": 45,
      "longestStreak": 45,
      "totalCompletions": 45,
      "completionRate": 100,
      "avgCompletionRate": 98.5
    }
  ]
}
```

---

### 5.5 GET `/api/analytics/habits/weak`
**Description**: Get habits needing attention

**Query Parameters**:
- `limit` (optional): Number of habits (default: 5)
- `threshold` (optional): Completion rate threshold (default: 50)

**Response**:
```json
{
  "data": [
    {
      "habitId": 3,
      "habitName": "Reading",
      "completionRate": 35.2,
      "currentStreak": 0,
      "daysWithoutCompletion": 5,
      "lastCompletedDate": "2024-11-13",
      "recommendation": "Try setting a smaller goal or different time"
    }
  ]
}
```

---

### 5.6 GET `/api/analytics/patterns`
**Description**: Get completion pattern data for heatmap

**Query Parameters**:
- `days` (optional): Number of days (default: 365)

**Response**:
```json
{
  "data": [
    {
      "date": "2024-11-18",
      "count": 6,
      "dayOfWeek": 1,
      "weekNumber": 46,
      "intensity": 3
    }
  ]
}
```

---

### 5.7 GET `/api/analytics/time-based`
**Description**: Get time-of-day completion analytics

**Query Parameters**:
- `days` (optional): Period in days (default: 30)

**Response**:
```json
{
  "data": [
    {
      "hour": 7,
      "completions": 25,
      "habits": ["Morning Run", "Meditation"],
      "successRate": 89.3
    }
  ],
  "bestTime": {
    "hour": 7,
    "completions": 25,
    "recommendation": "Schedule habits around 7:00 AM"
  }
}
```

---

### 5.8 GET `/api/analytics/consistency`
**Description**: Get overall consistency score

**Query Parameters**:
- `days` (optional): Period in days (default: 30)

**Response**:
```json
{
  "score": 85,
  "previousScore": 78,
  "trend": "up",
  "change": 7,
  "description": "Excellent consistency!",
  "breakdown": {
    "completionRate": 85,
    "streakConsistency": 90,
    "activeDaysRatio": 80,
    "recentPerformance": 85
  }
}
```

---

### 5.9 GET `/api/analytics/streaks`
**Description**: Get comprehensive streak analytics

**Response**:
```json
{
  "currentStreaks": [
    {
      "habitId": 1,
      "habitName": "Morning Run",
      "streak": 14
    }
  ],
  "longestStreaks": [
    {
      "habitId": 2,
      "habitName": "Meditation",
      "streak": 45
    }
  ],
  "averageStreak": 12.5,
  "totalActiveStreaks": 5,
  "milestones": {
    "week": 3,
    "month": 1,
    "quarter": 0,
    "year": 0
  }
}
```

---

### 5.10 GET `/api/analytics/insights`
**Description**: Get predictive insights and recommendations

**Response**:
```json
{
  "atRisk": [
    {
      "habitId": 2,
      "habitName": "Evening Walk",
      "currentStreak": 10,
      "reason": "No completion yesterday",
      "action": "Complete today to maintain streak"
    }
  ],
  "shouldFocus": [
    {
      "habitId": 3,
      "habitName": "Reading",
      "reason": "Completion rate below 50%",
      "suggestion": "Try reading for just 5 minutes to rebuild habit"
    }
  ],
  "bestTime": {
    "hour": 7,
    "reason": "Highest success rate at this time"
  },
  "recommendations": [
    {
      "type": "improvement",
      "title": "Group similar habits",
      "description": "Try completing Morning Run and Meditation together"
    }
  ]
}
```

---

### 5.11 GET `/api/analytics/export`
**Description**: Export analytics data

**Query Parameters**:
- `format`: 'csv' | 'json'
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string
- `type`: 'summary' | 'detailed' | 'all'

**Response**: File download

---

## 6. Frontend Requirements

### 6.1 Technology Stack
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Charts**: Recharts 2.10+
- **Styling**: Tailwind CSS
- **State**: React hooks (no global state needed)
- **API Client**: Axios with custom instance

### 6.2 Page Structure
```
/analytics
├── Period Selector (tabs)
├── Grid Layout
│   ├── Consistency Meter (1 col)
│   ├── Category Chart (1 col)
│   ├── Monthly Trend Chart (2 cols)
│   ├── Habit Comparison Chart (2 cols)
│   ├── Top Habits Card (1 col)
│   ├── Weak Habits Card (1 col)
│   ├── Time Heatmap (2 cols)
│   ├── Streak Stats (1 col)
│   └── Insights Panel (2 cols)
└── Export Button
```

### 6.3 Responsive Design
- **Desktop (>1024px)**: 2-column grid
- **Tablet (768-1024px)**: Mixed 1-2 column
- **Mobile (<768px)**: Single column stack

### 6.4 Loading States
- Skeleton loaders for each chart
- Shimmer effect
- Smooth transitions

### 6.5 Error Handling
- Graceful degradation
- Error boundaries
- Retry mechanisms
- User-friendly messages

### 6.6 Performance
- Lazy load components
- Memoize expensive calculations
- Debounce period changes
- Cache API responses (5 min)

---

## 7. Performance Considerations

### 7.1 Database Optimization

**Indexes Required**:
```sql
-- HabitLog indexes
CREATE INDEX idx_habit_logs_user_date ON habit_logs(userId, loggedDate);
CREATE INDEX idx_habit_logs_habit_date ON habit_logs(habitId, loggedDate);
CREATE INDEX idx_habit_logs_completed ON habit_logs(isCompleted, loggedDate);

-- Habit indexes
CREATE INDEX idx_habits_user_category ON habits(userId, category);
CREATE INDEX idx_habits_user_active ON habits(userId, isActive);

-- Streak indexes
CREATE INDEX idx_streaks_user ON streaks(userId);
CREATE INDEX idx_streaks_longest ON streaks(longestStreak DESC);
```

**Query Optimization**:
- Use batch queries where possible
- Limit result sets with pagination
- Aggregate in database, not application
- Use `SELECT` specific columns

### 7.2 Caching Strategy

**Cache Layers**:
1. **API Response Cache**: 5 minutes for analytics endpoints
2. **Database Query Cache**: Prisma caching for repeated queries
3. **Frontend Cache**: React Query with stale-while-revalidate

**Cache Keys**:
```
analytics:user:{userId}:categories:{startDate}:{endDate}
analytics:user:{userId}:comparison:{period}
analytics:user:{userId}:insights
```

**Invalidation**:
- On new habit completion
- On habit create/update/delete
- Manual refresh option

### 7.3 Large Dataset Handling

**Strategies**:
1. **Pagination**: Max 100 records per request
2. **Date Range Limits**: Max 2 years of data
3. **Aggregation**: Pre-calculate monthly/weekly stats
4. **Sampling**: Use sampling for very large datasets (>10k records)
5. **Virtual Scrolling**: For long lists in UI

**Thresholds**:
- Warn user if requesting >1 year of detailed data
- Suggest aggregated view for >6 months
- Auto-aggregate for >1 year

### 7.4 Calculation Optimization

**Heavy Calculations**:
- Consistency score calculation
- Trend analysis
- Pattern detection

**Optimization Methods**:
1. **Memoization**: Cache calculation results
2. **Background Jobs**: Calculate insights async (optional future)
3. **Incremental Updates**: Update only changed data
4. **Efficient Algorithms**: Use streaming algorithms where possible

---

## 8. Testing Strategy

### 8.1 Backend Testing

**Unit Tests** (services/analytics.service.ts):
```typescript
describe('AnalyticsService', () => {
  test('getCategoryDistribution - returns correct percentages')
  test('getHabitComparison - sorts by completion rate')
  test('getConsistencyScore - calculates weighted score')
  test('getPredictiveInsights - identifies at-risk habits')
  test('handles empty data gracefully')
  test('respects date range filters')
})
```

**Integration Tests** (controllers/analytics.controller.ts):
```typescript
describe('Analytics API', () => {
  test('GET /api/analytics/categories - returns 200')
  test('GET /api/analytics/categories - requires auth')
  test('GET /api/analytics/comparison - filters by date')
  test('GET /api/analytics/insights - returns predictions')
  test('Invalid date range returns 400')
})
```

### 8.2 Frontend Testing

**Component Tests**:
```typescript
describe('CategoryChart', () => {
  test('renders pie chart with data')
  test('shows percentages correctly')
  test('handles empty data')
  test('responsive on mobile')
})

describe('AnalyticsPage', () => {
  test('loads all charts on mount')
  test('updates on period change')
  test('handles loading state')
  test('handles error state')
  test('exports data correctly')
})
```

### 8.3 Manual Testing Checklist

**Accuracy Tests**:
- [ ] Verify calculations against manual counts
- [ ] Test with 0 habits
- [ ] Test with 1 habit
- [ ] Test with 10+ habits
- [ ] Test with 1 year+ of data
- [ ] Verify timezone handling

**UI Tests**:
- [ ] All charts render correctly
- [ ] Responsive on mobile (320px width)
- [ ] Responsive on tablet
- [ ] Dark mode support (if applicable)
- [ ] Loading states work
- [ ] Error states work
- [ ] Export functionality works

**Performance Tests**:
- [ ] Load time < 2s with 6 months data
- [ ] Load time < 5s with 1 year data
- [ ] No memory leaks on period change
- [ ] Smooth animations
- [ ] No layout shift

**Edge Cases**:
- [ ] New user with no data
- [ ] User with gaps in data
- [ ] All habits inactive
- [ ] Single category only
- [ ] Missing habit logs
- [ ] Incomplete streaks

---

## 9. Success Metrics

### 9.1 Performance Metrics
- Page load time: < 2s (p95)
- API response time: < 500ms (p95)
- Chart render time: < 100ms

### 9.2 User Engagement
- % of users visiting analytics page weekly
- Average time spent on analytics page
- Export feature usage rate
- Most viewed chart types

### 9.3 Data Quality
- Accuracy of predictions (retrospective analysis)
- User feedback on recommendations
- Consistency score correlation with actual behavior

---

## 10. Future Enhancements

### Phase 2 (Future)
1. **AI-Powered Insights**: Real ML models for predictions
2. **Social Comparison**: Compare with community averages (anonymized)
3. **Goal Setting**: Set targets based on analytics
4. **Custom Reports**: User-defined report builder
5. **Email Digests**: Weekly/monthly analytics emails
6. **Advanced Filters**: Filter by category, time, tags
7. **Habit Correlation**: Find habits that succeed together
8. **Predictive Scheduling**: AI suggests optimal habit schedule

### Phase 3 (Future)
1. **Team Analytics**: Compare with friends/family
2. **Coach Integration**: Share analytics with coach
3. **A/B Testing**: Test different habit strategies
4. **Voice Insights**: "Tell me about my habits"
5. **Wearable Integration**: Combine with health data

---

## 11. Implementation Checklist

### Backend
- [ ] Create analytics.service.ts with all methods
- [ ] Create analytics.controller.ts with all endpoints
- [ ] Create analytics.routes.ts
- [ ] Add database indexes
- [ ] Add input validation
- [ ] Add error handling
- [ ] Add rate limiting
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Update API documentation

### Frontend
- [ ] Create analytics.ts API client
- [ ] Create analyticsUtils.ts helpers
- [ ] Create analytics component directory
- [ ] Implement CategoryChart component
- [ ] Implement HabitComparisonChart component
- [ ] Implement MonthlyTrendChart component
- [ ] Implement TopHabitsCard component
- [ ] Implement WeakHabitsCard component
- [ ] Implement ConsistencyMeter component
- [ ] Implement InsightsPanel component
- [ ] Implement TimeHeatmap component
- [ ] Implement StreakStatsCard component
- [ ] Create main analytics page
- [ ] Add navigation link
- [ ] Add export functionality
- [ ] Write component tests
- [ ] Test responsive design
- [ ] Test performance

### Integration
- [ ] Connect frontend to backend
- [ ] Test end-to-end flows
- [ ] Verify data accuracy
- [ ] Load test with large datasets
- [ ] Security audit
- [ ] Accessibility audit
- [ ] Browser compatibility test

### Deployment
- [ ] Database migration (indexes)
- [ ] Deploy backend changes
- [ ] Deploy frontend changes
- [ ] Monitor performance
- [ ] Gather user feedback
- [ ] Iterate based on feedback

---

## 12. Appendix

### A. Color Palettes

**Chart Colors** (Category-based):
```javascript
{
  "운동": "#3B82F6",  // Blue
  "독서": "#10B981",  // Green
  "명상": "#8B5CF6",  // Purple
  "학습": "#F59E0B",  // Amber
  "건강": "#EF4444",  // Red
  "기타": "#6B7280"   // Gray
}
```

**Intensity Colors** (Heatmap):
```javascript
['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
```

**Status Colors**:
```javascript
{
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6'
}
```

### B. Sample Data Scenarios

**Scenario 1: New User**
- 2 habits, 3 days of data
- Should show: Basic charts, encouragement messages

**Scenario 2: Intermediate User**
- 5 habits, 30 days of data
- Should show: All analytics, some insights

**Scenario 3: Power User**
- 10+ habits, 1+ year of data
- Should show: Full analytics suite, deep insights

### C. Error Messages

```javascript
{
  NO_DATA: "No data available for this period",
  CALCULATION_ERROR: "Unable to calculate analytics",
  DATE_RANGE_INVALID: "Invalid date range selected",
  EXPORT_FAILED: "Failed to export data",
  NETWORK_ERROR: "Unable to fetch analytics"
}
```

---

## Document Information

- **Version**: 1.0
- **Last Updated**: 2025-11-18
- **Owner**: Development Team
- **Status**: Approved for Implementation
