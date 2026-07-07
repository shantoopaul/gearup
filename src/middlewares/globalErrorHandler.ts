import httpStatus from 'http-status';
import type { ErrorRequestHandler } from 'express';
import AppError from '../errors/AppError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';
    let errorDetails: unknown = err;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err;
    } else if (err instanceof Error) {
        message = err.message;
        errorDetails = {
            name: err.name,
            message: err.message,
        };
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};

export default globalErrorHandler;