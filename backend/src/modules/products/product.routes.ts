import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCategorySchema, createProductSchema, updateProductSchema } from '../../validators/product.validator';
import * as productController from './product.controller';

const router = Router();

router.use(authenticate);

// ── Categories ──
router.get('/categories', productController.getCategories);
router.post('/categories', authorize(['ADMIN', 'WAREHOUSE']), validate(createCategorySchema), productController.createCategory);

// ── Products ──
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', authorize(['ADMIN', 'WAREHOUSE']), validate(createProductSchema), productController.createProduct);
router.put('/:id', authorize(['ADMIN', 'WAREHOUSE']), validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', authorize(['ADMIN']), productController.deleteProduct);

export default router;
