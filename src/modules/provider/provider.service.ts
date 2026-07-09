import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { RentalStatus } from '../../../generated/prisma/client';

const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ['CONFIRMED'],
    CONFIRMED: [],
    PAID: ['PICKED_UP'],
    PICKED_UP: ['RETURNED'],
    RETURNED: [],
    CANCELLED: [],
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

const providerService = {
    updateOrderStatusInDB,
};

export default providerService;