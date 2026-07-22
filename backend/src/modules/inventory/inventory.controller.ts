import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as inventoryService from './inventory.service';

export const getMovements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const productId = req.query.productId as string;

    const result = await inventoryService.getMovements(page, limit, productId);

    sendSuccess({
      res,
      data: result.data,
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const recordMovement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, movementType, quantity, reason } = req.body;
    const userId = req.user!.userId; // Assumes auth middleware sets req.user

    const movement = await inventoryService.recordMovement(productId, movementType, quantity, userId, reason);

    sendSuccess({ res, status: 201, message: 'Inventory updated successfully', data: movement });
  } catch (error) {
    next(error);
  }
};
