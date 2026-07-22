import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../utils/response';
import * as analyticsService from './analytics.service';

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getDashboardMetrics();
    sendSuccess({ res, data });
  } catch (error) {
    next(error);
  }
};
