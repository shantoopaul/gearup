import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { UserStatus } from '../../../generated/prisma/client';

const userListSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
} as const;

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        select: userListSelect,
        orderBy: { createdAt: 'desc' },
    });

    return users;
};

const updateUserStatusInDB = async (id: string, status: UserStatus) => {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const updated = await prisma.user.update({
        where: { id },
        data: { status },
        select: userListSelect,
    });

    return updated;
};

const getAllGearFromDB = async () => {
    const gear = await prisma.gearItem.findMany({
        include: {
            category: true,
            provider: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return gear;
};

const getAllRentalsFromDB = async () => {
    const rentals = await prisma.rentalOrder.findMany({
        include: {
            gearItem: true,
            payment: true,
            customer: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return rentals;
};

const adminService = {
    getAllUsersFromDB,
    updateUserStatusInDB,
    getAllGearFromDB,
    getAllRentalsFromDB,
};

export default adminService;