import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { ICreateCategory } from './category.interface';

const createCategoryIntoDB = async (payload: ICreateCategory) => {
    const existingCategory = await prisma.category.findUnique({
        where: { name: payload.name },
    });

    if (existingCategory) {
        throw new AppError(httpStatus.CONFLICT, 'Category already exists with this name');
    }

    const category = await prisma.category.create({
        data: payload,
    });

    return category;
};

const getAllCategoriesFromDB = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
    });

    return categories;
};

const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
};

export default categoryService;