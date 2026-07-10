import { z } from 'zod';

const createPaymentValidation = z.object({
    body: z.object({
        rentalOrderId: z.uuid({ error: 'Valid rentalOrderId is required' }),
    }),
});

const confirmPaymentValidation = z.object({
    body: z.object({
        sessionId: z.string({ error: 'sessionId is required' })
            .min(1, 'sessionId is required'),
    }),
});

const paymentValidation = {
    createPaymentValidation,
    confirmPaymentValidation,
};

export default paymentValidation;