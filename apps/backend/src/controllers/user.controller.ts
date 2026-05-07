import type { Request, Response } from 'express';

export const userController = {
  findAll(_req: Request, res: Response) {
    res.status(200).json({ message: 'Find all users' });
  },
  findById(_req: Request, res: Response) {
    res.status(200).json({ message: 'Find user by ID' });
  },
  create(_req: Request, res: Response) {
    res.status(201).json({ message: 'Create user' });
  },
  update(_req: Request, res: Response) {
    res.status(200).json({ message: 'Update user' });
  },
  delete(_req: Request, res: Response) {
    res.status(200).json({ message: 'Delete user' });
  },
};
