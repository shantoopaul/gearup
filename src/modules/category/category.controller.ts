import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import categoryService from './category.service';

const createCategory: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.createCategoryIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Category created successfully',
        data: result,
    });
});

const getAllCategories: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Categories retrieved successfully',
        data: result,
    });
});

const categoryController = {
    createCategory,
    getAllCategories,
};

export default categoryController;