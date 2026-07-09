import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { ICreateReview } from './review.interface';

const createReviewIntoDB = async (payload: ICreateReview, customerId: string) => {
    const { rentalOrderId, rating, comment } = payload;

    const rentalOrder = await prisma.rentalOrder.findUnique({
        where: { id: rentalOrderId },
        include: { reviews: true },
    });

    if (!rentalOrder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Rental order not found');
    }

    if (rentalOrder.customerId !== customerId) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission to review this rental order');
    }

    if (rentalOrder.status !== 'RETURNED') {
        throw new AppError(httpStatus.BAD_REQUEST, 'You can only review a rental order after the gear has been returned');
    }

    if (rentalOrder.reviews) {
        throw new AppError(httpStatus.CONFLICT, 'A review already exists for this rental order');
    }

    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            customerId,
            gearItemId: rentalOrder.gearItemId,
            rentalOrderId,
        },
    });

    return review;
};

const reviewService = {
    createReviewIntoDB,
};

export default reviewService;