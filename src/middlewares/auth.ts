import httpStatus from 'http-status';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';
import config from '../config';
import { verifyToken } from '../utils/jwt';
import type { Role } from '../../generated/prisma/client';

const auth = (...allowedRoles: Role[]): RequestHandler => {
    return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
        }

        const decoded = verifyToken(token, config.jwt_access_secret!);

        if (allowedRoles.length && !allowedRoles.includes(decoded.role as Role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action');
        }

        req.user = decoded;
        next();
    });
};

export default auth;