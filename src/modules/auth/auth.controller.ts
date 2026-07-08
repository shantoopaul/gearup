import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import authService from './auth.service';

const register: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});

const login: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUserFromDB(req.body);
    const { refreshToken, ...responseData } = result;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.node_env === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: responseData,
    });
});

const refreshToken: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Refresh token not found');
    }

    const result = await authService.refreshTokenFromDB(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Access token generated successfully',
        data: result,
    });
});

const getUser: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.getUserFromDB(req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User retrieved successfully',
        data: result,
    });
});

const authController = {
    register,
    login,
    refreshToken,
    getUser,
};

export default authController;