import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import authValidation from './auth.validation';
import authController from './auth.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
    '/register',
    validateRequest(authValidation.registerValidation),
    authController.register
);

router.post(
    '/login',
    validateRequest(authValidation.loginValidation),
    authController.login
);

router.post('/refresh-token', authController.refreshToken);

router.get('/me', auth(), authController.getUser);

export default router;