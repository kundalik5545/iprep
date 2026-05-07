import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';

const router = Router();

router.get('/users', userController.findAll);
router.get('/users/:id', userController.findById);
router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

export { router as userRouter };
