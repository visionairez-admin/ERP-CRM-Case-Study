import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid('Invalid category ID'),
    sku: z.string().min(1, 'SKU is required'),
    name: z.string().min(1, 'Product name is required'),
    price: z.number().min(0, 'Price must be positive'),
    minimumStock: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    categoryId: z.string().uuid().optional(),
    sku: z.string().optional(),
    name: z.string().optional(),
    price: z.number().min(0).optional(),
    minimumStock: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});
