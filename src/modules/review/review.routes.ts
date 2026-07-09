import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import reviewValidation from './review.validation';
import reviewController from './review.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
    '/',
    auth('CUSTOMER'),
    validateRequest(reviewValidation.createReviewValidation),
    reviewController.createReview
);

export default router;