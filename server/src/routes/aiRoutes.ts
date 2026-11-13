import { Router } from 'express';
import { diagnoseVehicleIssue } from '../controllers/aiController';

const router = Router();

router.post('/diagnose', diagnoseVehicleIssue);

export default router;

