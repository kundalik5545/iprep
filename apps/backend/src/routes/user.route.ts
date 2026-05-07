import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.get('/users', asyncHandler(userController.findAll));
router.get('/users/:id', asyncHandler(userController.findById));
router.post('/users', asyncHandler(userController.create));
router.put('/users/:id', asyncHandler(userController.update));
router.delete('/users/:id', asyncHandler(userController.delete));

export { router as userRouter };
