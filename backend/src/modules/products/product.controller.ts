import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as productService from './product.service';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await productService.getCategories();
    sendSuccess({ res, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await productService.createCategory(req.body.name);
    sendSuccess({ res, status: 201, message: 'Category created', data: category });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const categoryId = req.query.categoryId as string;

    const result = await productService.getProducts(page, limit, search, categoryId);

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

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
    sendSuccess({ res, data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createProduct(req.body);
    sendSuccess({ res, status: 201, message: 'Product created', data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    sendSuccess({ res, message: 'Product updated', data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.deleteProduct(req.params.id);
    sendSuccess({ res, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
