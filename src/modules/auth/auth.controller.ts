import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import authService from './auth.service';

const registerUser: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'User registered successfully',
        data: result,
    });
});

const loginUser: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.loginUserFromDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
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
    registerUser,
    loginUser,
    getUser,
};

export default authController;