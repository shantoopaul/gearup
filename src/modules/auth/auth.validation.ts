import { z } from 'zod';

const registerUserValidationSchema = z.object({
    body: z.object({
        name: z.string({ error: 'Name is required' })
            .min(2, 'Name must be at least 2 characters')
            .max(100, "Name cannot exceed 100 characters"),
        email: z.email({ error: 'Email is required' }),
        password: z.string({ error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters')
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        role: z.enum(['CUSTOMER', 'PROVIDER'], { error: 'Role must be either CUSTOMER or PROVIDER' }),
    }),
});

const loginUserValidationSchema = z.object({
    body: z.object({
        email: z.email({ error: 'Email is required' }),
        password: z.string({ error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters'),
    }),
});

const authValidation = {
    registerUserValidationSchema,
    loginUserValidationSchema,
};

export default authValidation;