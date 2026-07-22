import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as saleService from './sale.service';

export const getSales = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const customerId = req.query.customerId as string;

    const result = await saleService.getSales(page, limit, customerId);

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

export const getSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    sendSuccess({ res, data: sale });
  } catch (error) {
    next(error);
  }
};

export const createSale = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId, items, notes } = req.body;
    const userId = req.user!.userId;

    const sale = await saleService.createSale(customerId, userId, notes, items);

    sendSuccess({ res, status: 201, message: 'Sales Challan created successfully', data: sale });
  } catch (error) {
    next(error);
  }
};
