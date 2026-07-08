import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import rentalService from './rental.service';

const createRentalOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.createRentalOrderIntoDB(req.body, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Rental order created successfully',
        data: result,
    });
});

const getUserRentalOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.getUserRentalOrdersFromDB(req.user.userId, req.user.role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rental orders retrieved successfully',
        data: result,
    });
});

const getSingleRentalOrder: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.getSingleRentalOrderFromDB(
        req.params.id as string,
        req.user.userId,
        req.user.role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rental order retrieved successfully',
        data: result,
    });
});

const rentalController = {
    createRentalOrder,
    getUserRentalOrders,
    getSingleRentalOrder,
};

export default rentalController;