import httpStatus from 'http-status';
import type { NextFunction, Request, Response } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction): void => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'API Not Found',
        errorDetails: {
            path: req.originalUrl,
            method: req.method,
        },
    });
};

export default notFound;