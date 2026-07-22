import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCustomerSchema, updateCustomerSchema } from '../../validators/customer.validator';
import * as customerController from './customer.controller';

const router = Router();

// Only ADMIN and SALES can manage customers
router.use(authenticate);
router.use(authorize(['ADMIN', 'SALES']));

router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.post('/', validate(createCustomerSchema), customerController.createCustomer);
router.put('/:id', validate(updateCustomerSchema), customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
