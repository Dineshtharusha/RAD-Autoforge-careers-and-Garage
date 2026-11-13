import { Router } from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/dashboard', protect, adminOnly, getDashboardAnalytics);

export default router;

