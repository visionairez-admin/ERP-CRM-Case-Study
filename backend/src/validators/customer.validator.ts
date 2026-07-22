import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, 'Business name is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().min(1, 'Phone number is required'),
    gstNumber: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    notes: z.string().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    businessName: z.string().optional(),
    contactName: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    gstNumber: z.string().optional(),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    notes: z.string().optional(),
  }),
});
