import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { BadRequestError } from '../../utils/errors';

export const findAllSales = async (page: number, limit: number, customerId?: string) => {
  const skip = (page - 1) * limit;
  const where: Prisma.SaleWhereInput = customerId ? { customerId } : {};

  const [data, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      skip,
      take: limit,
      include: {
        customer: { select: { businessName: true, contactName: true } },
        createdBy: { select: { name: true } },
        items: { include: { product: { select: { name: true, sku: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sale.count({ where }),
  ]);

  return { data, total };
};

export const findSaleById = async (id: string) => {
  return prisma.sale.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { include: { product: true } },
      createdBy: { select: { name: true } },
    },
  });
};

export const createSale = async (
  customerId: string,
  userId: string,
  notes: string | undefined,
  items: { productId: string; quantity: number }[]
) => {
  return prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new BadRequestError(`Product ${item.productId} not found`);

      if (product.currentStock < item.quantity) {
        throw new BadRequestError(`Insufficient stock for product ${product.name}`);
      }

      const unitPrice = product.price;
      const totalPrice = Number(unitPrice) * item.quantity;
      totalAmount += totalPrice;

      saleItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });

      // Update product stock
      await tx.product.update({
        where: { id: item.productId },
        data: { currentStock: product.currentStock - item.quantity },
      });

      // Record inventory movement for audit
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          movementType: 'OUT',
          quantity: item.quantity,
          reason: 'Sales Challan generated',
          createdById: userId,
        },
      });
    }

    // Create Sale Header
    const challanNumber = `CH-${Date.now()}`;
    const sale = await tx.sale.create({
      data: {
        customerId,
        createdById: userId,
        challanNumber,
        totalAmount,
        notes,
        items: {
          create: saleItems,
        },
      },
      include: { items: true },
    });

    return sale;
  });
};
