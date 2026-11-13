import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.route('/')
  .post(createBooking)
  .get(adminOnly, getAllBookings);

router.get('/my', getMyBookings);

router.route('/:id')
  .get(getBookingById);

router.patch('/:id/status', adminOnly, updateBookingStatus);
router.patch('/:id/cancel', cancelBooking);

export default router;

