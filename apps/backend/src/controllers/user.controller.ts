import type { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repo.js';

export const userController = {
  async findAll(_req: Request, res: Response) {
    const users = await userRepository.findAll();
    res.status(200).json({ message: 'Find all users', data: users });
  },
  async findById(req: Request, res: Response) {
    res.status(200).json({ message: 'Find user by ID' });
  },
  async create(req: Request, res: Response) {
    const user = await userRepository.create(req.body);
    res.status(201).json({ message: 'Create user', data: user });
  },
  async update(req: Request, res: Response) {
    res.status(200).json({ message: 'Update user' });
  },
  async delete(req: Request, res: Response) {
    res.status(200).json({ message: 'Delete user' });
  },
};
