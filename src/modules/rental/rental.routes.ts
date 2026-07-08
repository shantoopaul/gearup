import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import rentalValidation from './rental.validation';
import rentalController from './rental.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
    '/',
    auth('CUSTOMER'),
    validateRequest(rentalValidation.createRentalOrderValidationSchema),
    rentalController.createRentalOrder
);

export default router;