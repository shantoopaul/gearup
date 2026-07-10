import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { RentalStatus } from '../../../generated/prisma/client';
import type { IUpdateGear } from './provider.interface';

const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ['CONFIRMED'],
    CONFIRMED: [],
    PAID: ['PICKED_UP'],
    PICKED_UP: ['RETURNED'],
    RETURNED: [],
    CANCELLED: [],
};

const getProviderOrdersFromDB = async (providerId: string) => {
    const orders = await prisma.rentalOrder.findMany({
        where: { gearItem: { providerId } },
        include: {
            gearItem: true,
            payment: true,
            customer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return orders;
};

const updateOrderStatusInDB = async (id: string, providerId: string, status: RentalStatus) => {
    const rentalOrder = await prisma.rentalOrder.findUnique({
        where: { id },
        include: { gearItem: true },
    });

    if (!rentalOrder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental order not found');
    }

    if (rentalOrder.gearItem.providerId !== providerId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to update this rental order');
    }

    if (!allowedTransitions[rentalOrder.status].includes(status)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot change rental order status from ${rentalOrder.status} to ${status}`
        );
    }

    const updated = await prisma.rentalOrder.update({
        where: { id },
        data: { status },
    });

    return updated;
};

const updateGearInDB = async (id: string, providerId: string, payload: IUpdateGear) => {
    const gear = await prisma.gearItem.findUnique({
        where: { id },
    });

    if (!gear) {
        throw new AppError(httpStatus.NOT_FOUND, 'Gear item not found');
    }

    if (gear.providerId !== providerId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to update this gear item');
    }

    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: { id: payload.categoryId },
        });

        if (!category) {
            throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
        }
    }

    const updated = await prisma.gearItem.update({
        where: { id },
        data: payload,
    });

    return updated;
};

const providerService = {
    getProviderOrdersFromDB,
    updateOrderStatusInDB,
    updateGearInDB,
};

export default providerService;