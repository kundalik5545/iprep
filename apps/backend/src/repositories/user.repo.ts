import { prisma } from '@iprep/db';

export interface CreateUserInput {
  name: string;
  email: string;
}

export type UpdateUserInput = Partial<CreateUserInput>;

export const userRepository = {
  findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: CreateUserInput) {
    return prisma.user.create({ data });
  },

  update(id: string, data: UpdateUserInput) {
    return prisma.user.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
};
