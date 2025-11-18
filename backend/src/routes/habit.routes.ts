import { Router } from 'express';
import { habitController } from '../controllers/habit.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', habitController.createHabit);
router.get('/', habitController.getHabits);
router.get('/:id', habitController.getHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.patch('/:id/toggle', habitController.toggleActive);

export default router;
