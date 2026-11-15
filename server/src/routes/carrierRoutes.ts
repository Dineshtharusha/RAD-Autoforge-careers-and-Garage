import { Router } from 'express';
import {
  requestCarrier,
  getCarrierStatus,
  getMyCarrierRequests,
  updateCarrierStatus,
} from '../controllers/carrierController';

const router = Router();

// Dispatch a new carrier truck with live GPS tracking
router.post('/request', requestCarrier);

// Get user carrier requests or recent requests
router.get('/my-requests', getMyCarrierRequests);

// Get carrier tracking by ID or tracking code
router.get('/:id', getCarrierStatus);

// Update status (simulate progression or driver checkin)
router.patch('/:id/status', updateCarrierStatus);

export default router;
