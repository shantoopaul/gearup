import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import paymentService from './payment.service';

const createPayment: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.createPaymentIntoDB(req.body, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Payment session created successfully',
        data: result,
    });
});

const paymentController = {
    createPayment,
};

export default paymentController;