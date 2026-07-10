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

const updateCategory: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.updateCategoryInDB(
        req.params.id as string,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Category updated successfully',
        data: result,
    });
});

const deleteCategory: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.deleteCategoryFromDB(req.params.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Category deleted successfully',
        data: result,
    });
});

const categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};

export default categoryController;