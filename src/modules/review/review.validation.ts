import { z } from 'zod';

const createReviewValidation = z.object({
    body: z.object({
        rentalOrderId: z.uuid({ error: 'Valid rentalOrderId is required' }),
        rating: z.number({ error: 'Rating is required' })
            .int('Rating must be an integer')
            .min(1, 'Rating must be at least 1')
            .max(5, 'Rating cannot exceed 5'),
        comment: z.string()
            .max(1000, 'Comment cannot exceed 1000 characters')
            .optional(),
    }),
});

const reviewValidation = {
    createReviewValidation,
};

export default reviewValidation;