import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import adminService from './admin.service';

const getAllUsers: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Users retrieved successfully',
        data: result,
    });
});

const updateUserStatus: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.updateUserStatusInDB(
        req.params.id as string,
        req.body.status
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'User status updated successfully',
        data: result,
    });
});

const getAllGear: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllGearFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Gear listings retrieved successfully',
        data: result,
    });
});

const getAllRentals: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllRentalsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Rental orders retrieved successfully',
        data: result,
    });
});

const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllGear,
    getAllRentals,
};

export default adminController;