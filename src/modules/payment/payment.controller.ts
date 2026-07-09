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

const getUserPayments: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.getUserPaymentsFromDB(req.user.userId, req.user.role);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payments retrieved successfully',
        data: result,
    });
});

const getSinglePayment: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.getSinglePaymentFromDB(
        req.params.id as string,
        req.user.userId,
        req.user.role
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payment retrieved successfully',
        data: result,
    });
});

const paymentController = {
    createPayment,
    handleWebhook,
    getUserPayments,
    getSinglePayment,
};

export default paymentController;