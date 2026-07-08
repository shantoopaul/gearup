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

const authController = {
    registerUser,
};

export default authController;