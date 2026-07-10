import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import AppError from '../../errors/AppError';
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

const confirmPayment: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.confirmPaymentBySessionId(req.body.sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payment confirmed successfully',
        data: result,
    });
});

const paymentSuccess: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const sessionId = req.query.session_id as string | undefined;

    if (!sessionId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'session_id query parameter is required');
    }

    const result = await paymentService.confirmPaymentBySessionId(sessionId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payment completed successfully',
        data: result,
    });
});

const paymentCancel: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Payment was cancelled',
    });
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
    confirmPayment,
    paymentSuccess,
    paymentCancel,
    getUserPayments,
    getSinglePayment,
};

export default paymentController;