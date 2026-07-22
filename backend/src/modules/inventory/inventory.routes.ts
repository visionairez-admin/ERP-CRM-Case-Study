import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { inventoryMovementSchema } from '../../validators/inventory.validator';
import * as inventoryController from './inventory.controller';

const router = Router();

router.use(authenticate);

// Everyone can view, but only WAREHOUSE and ADMIN can record manual stock changes
router.get('/movements', inventoryController.getMovements);
router.post('/movements', authorize(['ADMIN', 'WAREHOUSE']), validate(inventoryMovementSchema), inventoryController.recordMovement);

export default router;
