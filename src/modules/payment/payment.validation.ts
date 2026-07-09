import { z } from 'zod';

const createPaymentValidation = z.object({
    body: z.object({
        rentalOrderId: z.uuid({ error: 'Valid rentalOrderId is required' }),
    }),
});

const paymentValidation = {
    createPaymentValidation,
};

export default paymentValidation;