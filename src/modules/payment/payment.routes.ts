import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import paymentValidation from './payment.validation';
import paymentController from './payment.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
    '/create',
    auth('CUSTOMER'),
    validateRequest(paymentValidation.createPaymentValidation),
    paymentController.createPayment
);

export default router;