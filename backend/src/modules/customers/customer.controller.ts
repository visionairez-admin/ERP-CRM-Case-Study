import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as customerService from './customer.service';

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await customerService.getAllCustomers(page, limit, search);
    
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

export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    sendSuccess({ res, data: customer });
  } catch (error) {
    next(error);
  }
};

export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    sendSuccess({ res, status: 201, message: 'Customer created', data: customer });
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    sendSuccess({ res, message: 'Customer updated', data: customer });
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await customerService.deleteCustomer(req.params.id);
    sendSuccess({ res, message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};
