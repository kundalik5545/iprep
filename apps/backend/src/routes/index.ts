import { Router } from 'express';
import { healthRouter } from './health.route.js';
import { userRouter } from './user.route.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/users', userRouter);

export { router as apiRouter };
