import { z } from 'zod';

const updateUserStatusValidation = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'SUSPENDED'], {
            error: 'Status must be either ACTIVE or SUSPENDED',
        }),
    }),
});

const adminValidation = {
    updateUserStatusValidation,
};

export default adminValidation;