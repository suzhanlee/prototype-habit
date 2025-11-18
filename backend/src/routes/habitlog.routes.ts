import { Router } from 'express';
import { habitLogController } from '../controllers/habitlog.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/:id/logs', habitLogController.checkIn);
router.get('/:id/logs', habitLogController.getLogs);
router.put('/:id/logs/:logId', habitLogController.updateLog);
router.delete('/:id/logs/:logId', habitLogController.deleteLog);

export default router;
