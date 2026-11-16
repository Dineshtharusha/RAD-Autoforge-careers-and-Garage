import { Router } from 'express';
import {
  getAllServices,
  getServiceByIdOrSlug,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.route('/')
  .get(getAllServices)
  .post(createService);

router.route('/:idOrSlug')
  .get(getServiceByIdOrSlug);

router.route('/:id')
  .put(updateService)
  .delete(deleteService);

export default router;

