import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import providerService from './provider.service';

const createGear: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await providerService.createGearIntoDB(req.body, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Gear created successfully',
        data: result,
    });
});

const getProviderOrders: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await providerService.getProviderOrdersFromDB(req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Provider orders retrieved successfully',
        data: result,
    });
});

const updateOrderStatus: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await providerService.updateOrderStatusInDB(
        req.params.id as string,
        req.user.userId,
        req.body.status
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rental order status updated successfully',
        data: result,
    });
});

const updateGear: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await providerService.updateGearInDB(
        req.params.id as string,
        req.user.userId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Gear updated successfully',
        data: result,
    });
});

const providerController = {
    createGear,
    getProviderOrders,
    updateOrderStatus,
    updateGear,
};

export default providerController;