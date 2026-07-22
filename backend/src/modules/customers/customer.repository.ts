import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

export const findAll = async (
  page: number,
  limit: number,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where: Prisma.CustomerWhereInput = search
    ? {
        OR: [
          { businessName: { contains: search, mode: 'insensitive' } },
          { contactName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count({ where }),
  ]);

  return { data, total };
};

export const findById = async (id: string) => {
  return prisma.customer.findUnique({ where: { id } });
};

export const create = async (data: Prisma.CustomerCreateInput) => {
  return prisma.customer.create({ data });
};

export const update = async (id: string, data: Prisma.CustomerUpdateInput) => {
  return prisma.customer.update({ where: { id }, data });
};

export const remove = async (id: string) => {
  return prisma.customer.delete({ where: { id } });
};
