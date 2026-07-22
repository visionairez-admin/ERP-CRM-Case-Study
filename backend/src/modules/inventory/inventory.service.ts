import * as inventoryRepository from './inventory.repository';
import { MovementType } from '@prisma/client';

export const getMovements = async (page = 1, limit = 10, productId?: string) => {
  return inventoryRepository.findAllMovements(page, limit, productId);
};

export const recordMovement = async (
  productId: string,
  movementType: MovementType,
  quantity: number,
  userId: string,
  reason?: string
) => {
  return inventoryRepository.createMovement(productId, movementType, quantity, userId, reason);
};
