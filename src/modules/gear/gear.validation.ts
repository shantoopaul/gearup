import { z } from 'zod';

const createGearValidation = z.object({
    body: z.object({
        title: z.string({ error: 'Title is required' })
            .min(2, 'Title must be at least 2 characters')
            .max(200, 'Title cannot exceed 200 characters'),
        description: z.string({ error: 'Description is required' })
            .min(10, 'Description must be at least 10 characters'),
        brand: z.string({ error: 'Brand is required' })
            .min(1, 'Brand is required'),
        pricePerDay: z.number({ error: 'Price per day is required' })
            .positive('Price per day must be greater than 0'),
        quantity: z.number()
            .int('Quantity must be an integer')
            .positive('Quantity must be greater than 0')
            .optional(),
        images: z.array(z.url('Each image must be a valid URL')).optional(),
        categoryId: z.uuid({ error: 'Valid categoryId is required' }),
    }),
});

const gearValidation = {
    createGearValidation,
};

export default gearValidation;