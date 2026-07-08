import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import { generateToken, verifyToken } from '../../utils/jwt';
import type { IRegister, ILogin } from './auth.interface';

const registerUserIntoDB = async (payload: IRegister) => {
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

const loginUserFromDB = async (payload: ILogin) => {
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

    const jwtPayload = { userId: user.id, role: user.role };

    const accessToken = generateToken(
        jwtPayload,
        config.jwt_access_secret!,
        config.jwt_access_expires_in
    );

    const refreshToken = generateToken(
        jwtPayload,
        config.jwt_refresh_secret!,
        config.jwt_refresh_expires_in
    );

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        },
    };
};

const refreshTokenFromDB = async (token: string) => {
    let decoded;

    try {
        decoded = verifyToken(token, config.jwt_refresh_secret!);
    } catch {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.status === 'SUSPENDED') {
        throw new AppError(httpStatus.FORBIDDEN, 'Your account has been suspended');
    }

    const accessToken = generateToken(
        { userId: user.id, role: user.role },
        config.jwt_access_secret!,
        config.jwt_access_expires_in
    );

    return { accessToken };
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
    refreshTokenFromDB,
    getUserFromDB,
};

export default authService;