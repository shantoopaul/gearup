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

const getUserRentalOrdersFromDB = async (userId: string, role: string) => {
    if (role === 'ADMIN') {
        return prisma.rentalOrder.findMany({
            include: {
                gearItem: true,
                payment: true,
                customer: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    if (role === 'PROVIDER') {
        return prisma.rentalOrder.findMany({
            where: { gearItem: { providerId: userId } },
            include: {
                gearItem: true,
                payment: true,
                customer: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    return prisma.rentalOrder.findMany({
        where: { customerId: userId },
        include: {
            gearItem: true,
            payment: true,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const getSingleRentalOrderFromDB = async (id: string, userId: string, role: string) => {
    const rentalOrder = await prisma.rentalOrder.findUnique({
        where: { id },
        include: {
            gearItem: true,
            payment: true,
            customer: { select: { id: true, name: true, email: true } },
        },
    });

    if (!rentalOrder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental order not found');
    }

    const isOwner = rentalOrder.customerId === userId;
    const isProvider = rentalOrder.gearItem.providerId === userId;

    if (role !== 'ADMIN' && !isOwner && !isProvider) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to view this rental order');
    }

    return rentalOrder;
};

const rentalService = {
    createRentalOrderIntoDB,
    getUserRentalOrdersFromDB,
    getSingleRentalOrderFromDB,
};

export default rentalService;