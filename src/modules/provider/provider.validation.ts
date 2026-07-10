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

const updateOrderStatusValidation = z.object({
    body: z.object({
        status: z.enum(['CONFIRMED', 'PICKED_UP', 'RETURNED'], {
            error: 'Status must be one of CONFIRMED, PICKED_UP, RETURNED',
        }),
    }),
});

const updateGearValidation = z.object({
    body: z.object({
        title: z.string()
            .min(2, 'Title must be at least 2 characters')
            .max(200, 'Title cannot exceed 200 characters')
            .optional(),
        description: z.string()
            .min(10, 'Description must be at least 10 characters')
            .optional(),
        brand: z.string()
            .min(1, 'Brand is required')
            .optional(),
        pricePerDay: z.number()
            .positive('Price per day must be greater than 0')
            .optional(),
        quantity: z.number()
            .int('Quantity must be an integer')
            .positive('Quantity must be greater than 0')
            .optional(),
        isAvailable: z.boolean().optional(),
        images: z.array(z.url('Each image must be a valid URL')).optional(),
        categoryId: z.uuid({ error: 'Valid categoryId is required' }).optional(),
    }),
});

const providerValidation = {
    createGearValidation,
    updateOrderStatusValidation,
    updateGearValidation,
};

export default providerValidation;