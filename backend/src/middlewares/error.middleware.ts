import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = JSON.parse(err.message);
  } else {
    console.error('💥 UNEXPECTED ERROR:', err);
  }

  // Hide stack trace in production
  if (env.NODE_ENV === 'development' && !(err instanceof AppError)) {
    errors = err.stack;
  }

  sendError({ res, status: statusCode, message, errors });
};
