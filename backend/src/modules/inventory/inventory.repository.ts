import { Prisma, MovementType } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { BadRequestError } from '../../utils/errors';

export const findAllMovements = async (page: number, limit: number, productId?: string) => {
  const skip = (page - 1) * limit;

  const where: Prisma.InventoryMovementWhereInput = productId ? { productId } : {};

  const [data, total] = await Promise.all([
    prisma.inventoryMovement.findMany({
      where,
      skip,
      take: limit,
      include: {
        product: { select: { name: true, sku: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.inventoryMovement.count({ where }),
  ]);

  return { data, total };
};

export const createMovement = async (
  productId: string,
  movementType: MovementType,
  quantity: number,
  userId: string,
  reason?: string
) => {
  return prisma.$transaction(async (tx) => {
    // Lock product for update or just check stock
    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!product) throw new BadRequestError('Product not found');

    if (movementType === 'OUT' && product.currentStock < quantity) {
      throw new BadRequestError(`Insufficient stock. Available: ${product.currentStock}`);
    }

    const newStock =
      movementType === 'IN'
        ? product.currentStock + quantity
        : product.currentStock - quantity;

    // 1. Update product stock
    await tx.product.update({
      where: { id: productId },
      data: { currentStock: newStock },
    });

    // 2. Record movement
    const movement = await tx.inventoryMovement.create({
      data: {
        productId,
        movementType,
        quantity,
        reason,
        createdById: userId,
      },
    });

    return movement;
  });
};
