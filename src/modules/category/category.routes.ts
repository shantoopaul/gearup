import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import categoryValidation from './category.validation';
import categoryController from './category.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', categoryController.getAllCategories);

router.post(
    '/',
    auth('ADMIN'),
    validateRequest(categoryValidation.createCategoryValidation),
    categoryController.createCategory
);

router.put(
    '/:id',
    auth('ADMIN'),
    validateRequest(categoryValidation.updateCategoryValidation),
    categoryController.updateCategory
);

router.delete(
    '/:id',
    auth('ADMIN'),
    categoryController.deleteCategory
);

export default router;