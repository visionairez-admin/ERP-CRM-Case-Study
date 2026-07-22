import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, signupSchema, refreshTokenSchema } from '../../validators/auth.validator';
import * as authController from './auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.get('/me', authenticate, authController.me);

export default router;
