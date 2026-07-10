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

router.post(
    '/confirm',
    auth(),
    validateRequest(paymentValidation.confirmPaymentValidation),
    paymentController.confirmPayment
);

router.get('/success', paymentController.paymentSuccess);

router.get('/cancel', paymentController.paymentCancel);

router.get('/', auth(), paymentController.getUserPayments);

router.get('/:id', auth(), paymentController.getSinglePayment);

export default router;