import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import type { IRegisterUser } from './auth.interface';

const registerUserIntoDB = async (payload: IRegisterUser) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, 'User already exists with this email');
    }

    const saltRounds = Number(config.bcrypt_salt_rounds) || 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

    const user = await prisma.user.create({
        data: {
            ...payload,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });

    return user;
};

const authService = {
    registerUserIntoDB,
};

export default authService;