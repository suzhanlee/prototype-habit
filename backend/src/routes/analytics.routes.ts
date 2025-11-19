import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication
router.use(authMiddleware);

/**
 * GET /api/analytics/categories
 * Get habit completion distribution by category
 */
router.get('/categories', analyticsController.getCategoryDistribution);

/**
 * GET /api/analytics/comparison
 * Compare performance across all habits
 */
router.get('/comparison', analyticsController.getHabitComparison);

/**
 * GET /api/analytics/trends/monthly
 * Get monthly completion trends
 */
router.get('/trends/monthly', analyticsController.getMonthlyTrend);

/**
 * GET /api/analytics/habits/top
 * Get top performing habits
 */
router.get('/habits/top', analyticsController.getTopHabits);

/**
 * GET /api/analytics/habits/weak
 * Get habits needing attention
 */
router.get('/habits/weak', analyticsController.getWeakHabits);

/**
 * GET /api/analytics/patterns
 * Get completion pattern data for heatmap
 */
router.get('/patterns', analyticsController.getCompletionPattern);

/**
 * GET /api/analytics/time-based
 * Get time-of-day completion analytics
 */
router.get('/time-based', analyticsController.getTimeBasedAnalytics);

/**
 * GET /api/analytics/consistency
 * Get overall consistency score
 */
router.get('/consistency', analyticsController.getConsistencyScore);

/**
 * GET /api/analytics/streaks
 * Get comprehensive streak analytics
 */
router.get('/streaks', analyticsController.getStreakAnalytics);

/**
 * GET /api/analytics/insights
 * Get predictive insights and recommendations
 */
router.get('/insights', analyticsController.getPredictiveInsights);

export default router;