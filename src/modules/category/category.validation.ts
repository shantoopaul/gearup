import { z } from 'zod';

const createCategoryValidation = z.object({
    body: z.object({
        name: z.string({ error: 'Name is required' })
            .min(2, 'Name must be at least 2 characters')
            .max(100, "Name cannot exceed 100 characters"),
    }),
});

const categoryValidation = {
    createCategoryValidation,
};

export default categoryValidation;