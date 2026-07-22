import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import * as analyticsController from './analytics.controller';

const router = Router();

router.use(authenticate);

router.get('/dashboard', analyticsController.getDashboardData);

export default router;
