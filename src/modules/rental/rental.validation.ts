import { z } from 'zod';

const createRentalValidation = z.object({
    body: z.object({
        gearItemId: z.uuid({ error: 'Valid gearItemId is required' }),
        startDate: z.iso.datetime({ error: 'Valid startDate (ISO 8601) is required' }),
        endDate: z.iso.datetime({ error: 'Valid endDate (ISO 8601) is required' }),
        quantity: z.number()
            .int('Quantity must be an integer')
            .positive('Quantity must be greater than 0')
            .optional(),
    }),
});

const rentalValidation = {
    createRentalValidation,
};

export default rentalValidation;