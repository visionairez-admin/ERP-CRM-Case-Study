import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendError } from '../utils/response';

export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendError({
          res,
          status: 400,
          message: 'Validation Error',
          errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
        });
      }
      next(error);
    }
  };
};
