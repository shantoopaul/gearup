import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { stripe } from '../../lib/stripe';
import config from '../../config';
import type { ICreatePayment } from './payment.interface';
import type Stripe from 'stripe';

const createPaymentIntoDB = async (payload: ICreatePayment, customerId: string) => {
    const { rentalOrderId } = payload;

    const rentalOrder = await prisma.rentalOrder.findUnique({
        where: { id: rentalOrderId },
        include: { payment: true, gearItem: true },
    });

    if (!rentalOrder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental order not found');
    }

    if (rentalOrder.customerId !== customerId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to pay for this rental order');
    }

    if (rentalOrder.payment) {
        throw new AppError(httpStatus.CONFLICT, 'A payment already exists for this rental order');
    }

    if (rentalOrder.status !== 'CONFIRMED') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Payment can only be made for a rental order that has been confirmed by the provider'
        );
    }

    const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: rentalOrder.gearItem.title,
                    },
                    unit_amount: Math.round(Number(rentalOrder.totalPrice) * 100),
                },
                quantity: 1,
            },
        ],
        success_url: `${config.app_url}/api/payments/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app_url}/api/payments/cancel?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            rentalOrderId: rentalOrder.id,
        },
    });

    const payment = await prisma.payment.create({
        data: {
            transactionId: session.id,
            amount: rentalOrder.totalPrice,
            method: 'STRIPE',
            status: 'PENDING',
            rentalOrderId: rentalOrder.id,
        },
    });

    return { checkoutUrl: session.url, payment };
};

const markPaymentCompleted = async (paymentId: string, rentalOrderId: string) => {
    await prisma.$transaction([
        prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'COMPLETED', paidAt: new Date() },
        }),
        prisma.rentalOrder.update({
            where: { id: rentalOrderId },
            data: { status: 'PAID' },
        }),
    ]);
};

const confirmPaymentFromWebhook = async (rawBody: Buffer, signature: string) => {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, signature, config.stripe_webhook_secret!);
    } catch {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const payment = await prisma.payment.findUnique({
            where: { transactionId: session.id },
        });

        if (!payment || payment.status === 'COMPLETED') {
            return;
        }

        await markPaymentCompleted(payment.id, payment.rentalOrderId);
    }
};

const confirmPaymentBySessionId = async (sessionId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { transactionId: sessionId },
        include: { rentalOrder: { include: { gearItem: true } } },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'No payment found for this session');
    }

    if (payment.status === 'COMPLETED') {
        return payment;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
        throw new AppError(httpStatus.BAD_REQUEST, 'Payment has not been completed yet');
    }

    await markPaymentCompleted(payment.id, payment.rentalOrderId);

    const updated = await prisma.payment.findUnique({
        where: { id: payment.id },
        include: { rentalOrder: true },
    });

    return updated;
};

const getUserPaymentsFromDB = async (userId: string, role: string) => {
    if (role === 'ADMIN') {
        return prisma.payment.findMany({
            include: {
                rentalOrder: {
                    include: {
                        gearItem: true,
                        customer: { select: { id: true, name: true, email: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    if (role === 'PROVIDER') {
        return prisma.payment.findMany({
            where: { rentalOrder: { gearItem: { providerId: userId } } },
            include: {
                rentalOrder: {
                    include: {
                        gearItem: true,
                        customer: { select: { id: true, name: true, email: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    return prisma.payment.findMany({
        where: { rentalOrder: { customerId: userId } },
        include: {
            rentalOrder: {
                include: { gearItem: true },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getSinglePaymentFromDB = async (id: string, userId: string, role: string) => {
    const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
            rentalOrder: {
                include: {
                    gearItem: true,
                    customer: { select: { id: true, name: true, email: true } },
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    const isOwner = payment.rentalOrder.customerId === userId;
    const isProvider = payment.rentalOrder.gearItem.providerId === userId;

    if (role !== 'ADMIN' && !isOwner && !isProvider) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to view this payment');
    }

    return payment;
};

const paymentService = {
    createPaymentIntoDB,
    confirmPaymentFromWebhook,
    confirmPaymentBySessionId,
    getUserPaymentsFromDB,
    getSinglePaymentFromDB,
};

export default paymentService;