import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import reviewService from './review.service';

const createReview: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewService.createReviewIntoDB(req.body, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Review created successfully',
        data: result,
    });
});

const reviewController = {
    createReview,
};

export default reviewController;