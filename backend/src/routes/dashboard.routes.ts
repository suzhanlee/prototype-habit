import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/today', dashboardController.getTodayOverview);
router.get('/stats', dashboardController.getStats);
router.get('/heatmap', dashboardController.getHeatmapData);
router.get('/weekly', dashboardController.getWeeklyStats);

export default router;
