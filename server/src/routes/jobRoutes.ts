import { Router } from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .get(getAllJobs)
  .post(protect, adminOnly, createJob);

router.route('/:id')
  .get(getJobById)
  .put(protect, adminOnly, updateJob)
  .delete(protect, adminOnly, deleteJob);

export default router;

