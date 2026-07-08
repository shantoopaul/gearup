import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: ZodType) => {
    return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
        await schema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query,
        });
        next();
    });
};

export default validateRequest;