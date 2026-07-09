import { z } from 'zod';

const updateOrderStatusValidation = z.object({
    body: z.object({
        status: z.enum(['CONFIRMED', 'PICKED_UP', 'RETURNED'], {
            error: 'Status must be one of CONFIRMED, PICKED_UP, RETURNED',
        }),
    }),
});

const providerValidation = {
    updateOrderStatusValidation,
};

export default providerValidation;