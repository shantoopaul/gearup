import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { ICreateRentalOrder } from './rental.interface';

const createRentalOrderIntoDB = async (payload: ICreateRentalOrder, customerId: string) => {
    const { gearItemId, startDate, endDate, quantity = 1 } = payload;

    const gear = await prisma.gearItem.findUnique({
        where: { id: gearItemId },
    });

    if (!gear) {
        throw new AppError(httpStatus.NOT_FOUND, 'Gear item not found');
    }

    if (!gear.isAvailable) {
        throw new AppError(httpStatus.BAD_REQUEST, 'This gear item is currently unavailable');
    }

    if (gear.quantity < quantity) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Requested quantity exceeds available stock');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
        throw new AppError(httpStatus.BAD_REQUEST, 'endDate must be after startDate');
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = Number(gear.pricePerDay) * days * quantity;

    const rentalOrder = await prisma.rentalOrder.create({
        data: {
            startDate: start,
            endDate: end,
            quantity,
            totalPrice,
            customerId,
            gearItemId,
        },
    });

    return rentalOrder;
};

const rentalService = {
    createRentalOrderIntoDB,
};

export default rentalService;