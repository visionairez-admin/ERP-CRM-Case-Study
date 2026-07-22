import { Response } from 'express';

type SuccessResponseParams<T> = {
  res: Response;
  status?: number;
  message?: string;
  data?: T;
  meta?: any;
};

export const sendSuccess = <T>({ res, status = 200, message = 'Success', data, meta }: SuccessResponseParams<T>) => {
  res.status(status).json({
    success: true,
    message,
    data: data || null,
    meta,
  });
};

type ErrorResponseParams = {
  res: Response;
  status?: number;
  message?: string;
  errors?: any;
};

export const sendError = ({ res, status = 500, message = 'Internal Server Error', errors }: ErrorResponseParams) => {
  res.status(status).json({
    success: false,
    message,
    errors,
  });
};
