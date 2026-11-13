import { Router } from 'express';
import {
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} from '../controllers/workshopController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .get(getAllWorkshops)
  .post(protect, adminOnly, createWorkshop);

router.route('/:id')
  .get(getWorkshopById)
  .put(protect, adminOnly, updateWorkshop)
  .delete(protect, adminOnly, deleteWorkshop);

export default router;

