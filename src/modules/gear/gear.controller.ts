import httpStatus from 'http-status';
import type { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import gearService from './gear.service';
import type { IGearFilters } from './gear.interface';

const createGear: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await gearService.createGearIntoDB(req.body, req.user.userId);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: 'Gear created successfully',
        data: result,
    });
});

const getAllGears: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const { data, meta } = await gearService.getAllGearsFromDB(req.query as IGearFilters);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Gears retrieved successfully',
        data,
        meta,
    });
});

const getSingleGear: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const result = await gearService.getSingleGearFromDB(req.params.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: 'Gear retrieved successfully',
        data: result,
    });
});

const gearController = {
    createGear,
    getAllGears,
    getSingleGear,
};

export default gearController;