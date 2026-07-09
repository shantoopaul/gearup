import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import providerService from './provider.service';

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

const providerController = {
    getProviderOrders,
    updateOrderStatus,
};

export default providerController;