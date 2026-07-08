import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import authValidation from './auth.validation';
import authController from './auth.controller';

const router = Router();

router.post(
    '/register',
    validateRequest(authValidation.registerUserValidationSchema),
    authController.registerUser
);

export default router;