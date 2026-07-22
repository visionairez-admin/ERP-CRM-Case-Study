import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createSaleSchema } from '../../validators/sale.validator';
import * as saleController from './sale.controller';

const router = Router();

router.use(authenticate);

// Everyone can view sales, only ADMIN and SALES can create them
router.get('/', saleController.getSales);
router.get('/:id', saleController.getSale);
router.post('/', authorize(['ADMIN', 'SALES']), validate(createSaleSchema), saleController.createSale);

export default router;
