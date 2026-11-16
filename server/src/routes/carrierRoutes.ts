import { Router } from 'express';
import {
  requestCarrier,
  getCarrierStatus,
  getMyCarrierRequests,
  updateCarrierStatus,
  calculateDistancePreview,
  getCarrierFleetLorries,
  createCarrierLorry,
  updateCarrierLorry,
  deleteCarrierLorry,
  getAllCarrierRequests,
} from '../controllers/carrierController';

const router = Router();

// Calculate distance and nearest garage preview
router.post('/calculate-distance', calculateDistancePreview);

// Dispatch a new carrier truck with live GPS tracking
router.post('/request', requestCarrier);

// Get user carrier requests or recent requests
router.get('/my-requests', getMyCarrierRequests);

// Admin: Get all customer breakdown requests
router.get('/all-requests', getAllCarrierRequests);

// Admin: Fleet Lorries CRUD
router.get('/lorries', getCarrierFleetLorries);
router.post('/lorries', createCarrierLorry);
router.put('/lorries/:id', updateCarrierLorry);
router.delete('/lorries/:id', deleteCarrierLorry);

// Get carrier tracking by ID or tracking code
router.get('/:id', getCarrierStatus);

// Update status (simulate progression or driver checkin)
router.patch('/:id/status', updateCarrierStatus);

export default router;
