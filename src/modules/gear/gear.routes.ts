import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import gearValidation from './gear.validation';
import gearController from './gear.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', gearController.getAllGears);

router.get('/:id', gearController.getSingleGear);

router.post(
    '/',
    auth('PROVIDER'),
    validateRequest(gearValidation.createGearValidationSchema),
    gearController.createGear
);

export default router;