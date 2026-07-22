import { z } from 'zod';

export const createSaleSchema = z.object({
  body: z.object({
    customerId: z.string().uuid('Invalid customer ID'),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          productId: z.string().uuid('Invalid product ID'),
          quantity: z.number().int().positive('Quantity must be positive'),
        })
      )
      .min(1, 'At least one item is required'),
  }),
});
