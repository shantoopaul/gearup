import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import adminValidation from './admin.validation';
import adminController from './admin.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/users', auth('ADMIN'), adminController.getAllUsers);

router.patch(
    '/users/:id',
    auth('ADMIN'),
    validateRequest(adminValidation.updateUserStatusValidation),
    adminController.updateUserStatus
);

router.get('/gear', auth('ADMIN'), adminController.getAllGear);

router.get('/rentals', auth('ADMIN'), adminController.getAllRentals);

export default router;