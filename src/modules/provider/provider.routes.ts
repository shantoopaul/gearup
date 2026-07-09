import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import providerValidation from './provider.validation';
import providerController from './provider.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.patch(
    '/:id',
    auth('PROVIDER'),
    validateRequest(providerValidation.updateOrderStatusValidation),
    providerController.updateOrderStatus
);

export default router;