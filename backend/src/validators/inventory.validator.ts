import { z } from 'zod';

export const inventoryMovementSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    movementType: z.enum(['IN', 'OUT']),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    reason: z.string().optional(),
  }),
});
