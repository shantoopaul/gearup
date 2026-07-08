import { z } from 'zod';

const registerUserValidationSchema = z.object({
    body: z.object({
        name: z.string({ error: 'Name is required' }).min(2, 'Name must be at least 2 characters').max(100),
        email: z.email({ error: 'A valid email is required' }),
        password: z.string({ error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
        role: z.enum(['CUSTOMER', 'PROVIDER'], { error: 'Role must be either CUSTOMER or PROVIDER' }),
    }),
});

const loginUserValidationSchema = z.object({
    body: z.object({
        email: z.email({ error: 'A valid email is required' }),
        password: z.string({ error: 'Password is required' }).min(1, 'Password is required'),
    }),
});

const authValidation = {
    registerUserValidationSchema,
    loginUserValidationSchema,
};

export default authValidation;