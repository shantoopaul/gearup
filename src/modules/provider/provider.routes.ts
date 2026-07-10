import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import providerValidation from './provider.validation';
import providerController from './provider.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
    '/gear',
    auth('PROVIDER'),
    validateRequest(providerValidation.createGearValidation),
    providerController.createGear
);

router.get('/orders', auth('PROVIDER'), providerController.getProviderOrders);

router.patch(
    '/orders/:id',
    auth('PROVIDER'),
    validateRequest(providerValidation.updateOrderStatusValidation),
    providerController.updateOrderStatus
);

router.put(
    '/gear/:id',
    auth('PROVIDER'),
    validateRequest(providerValidation.updateGearValidation),
    providerController.updateGear
);

router.delete('/gear/:id', auth('PROVIDER'), providerController.deleteGear);

export default router;