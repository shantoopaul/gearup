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

const handleWebhook: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    await paymentService.confirmPaymentFromWebhook(req.body, signature);

    res.status(httpStatus.OK).json({ received: true });
});

const paymentController = {
    createPayment,
    handleWebhook,
};

export default paymentController;