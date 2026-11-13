import { Router } from 'express';
import {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/applicationController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.post('/', submitApplication);
router.get('/', protect, adminOnly, getAllApplications);
router.patch('/:id/status', protect, adminOnly, updateApplicationStatus);

export default router;

