import { Router } from 'express';
import { healthController } from '../controllers/health.controller.js';

const router = Router();

router.get('/health-check', healthController.check);

export { router as healthRouter };
