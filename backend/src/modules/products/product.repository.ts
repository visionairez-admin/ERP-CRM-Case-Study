import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

// ── Categories ──
export const findAllCategories = () => prisma.category.findMany();

export const findCategoryById = (id: string) => prisma.category.findUnique({ where: { id } });

export const createCategory = (name: string) => prisma.category.create({ data: { name } });

// ── Products ──
export const findAllProducts = async (page: number, limit: number, search?: string, categoryId?: string) => {
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...(categoryId && { categoryId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return { data, total };
};

export const findProductById = (id: string) =>
  prisma.product.findUnique({ where: { id }, include: { category: true } });

export const createProduct = (data: Prisma.ProductCreateInput) =>
  prisma.product.create({ data });

export const updateProduct = (id: string, data: Prisma.ProductUpdateInput) =>
  prisma.product.update({ where: { id }, data });

export const removeProduct = (id: string) =>
  prisma.product.delete({ where: { id } });
