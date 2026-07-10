import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import rentalService from './rental.service';

const createRental: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.createRentalIntoDB(req.body, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Rental order created successfully',
        data: result,
    });
});

const getUserRentals: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.getUserRentalsFromDB(req.user.userId, req.user.role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rental orders retrieved successfully',
        data: result,
    });
});

const getSingleRental: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.getSingleRentalFromDB(
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

const cancelRental: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await rentalService.cancelRentalInDB(req.params.id as string, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rental order cancelled successfully',
        data: result,
    });
});

const rentalController = {
    createRental,
    getUserRentals,
    getSingleRental,
    cancelRental,
};

export default rentalController;