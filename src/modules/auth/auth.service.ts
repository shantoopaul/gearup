import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import { generateToken } from '../../utils/jwt';
import type { IRegisterUser, ILoginUser } from './auth.interface';

const registerUserIntoDB = async (payload: IRegisterUser) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (existingUser) {
        throw new AppError(httpStatus.CONFLICT, 'User already exists with this email');
    }

    const saltRounds = Number(config.bcrypt_salt_rounds);
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

const loginUserFromDB = async (payload: ILoginUser) => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email');
    }

    if (user.status === 'SUSPENDED') {
        throw new AppError(httpStatus.FORBIDDEN, 'Your account has been suspended');
    }

    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    const accessToken = generateToken(
        { userId: user.id, role: user.role },
        config.jwt_access_secret!,
        config.jwt_access_expires_in
    );

    return {
        accessToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        },
    };
};

const getUserFromDB = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
};

const authService = {
    registerUserIntoDB,
    loginUserFromDB,
    getUserFromDB,
};

export default authService;