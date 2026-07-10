import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { ICreateCategory, IUpdateCategory } from './category.interface';

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

const updateCategoryInDB = async (id: string, payload: IUpdateCategory) => {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    if (payload.name) {
        const existingCategory = await prisma.category.findUnique({
            where: { name: payload.name },
        });

        if (existingCategory && existingCategory.id !== id) {
            throw new AppError(httpStatus.CONFLICT, 'Category already exists with this name');
        }
    }

    const updated = await prisma.category.update({
        where: { id },
        data: payload,
    });

    return updated;
};

const deleteCategoryFromDB = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { gearItems: true } } },
    });

    if (!category) {
        throw new AppError(httpStatus.NOT_FOUND, 'Category not found');
    }

    if (category._count.gearItems > 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot delete category with gear items linked to it'
        );
    }

    const deleted = await prisma.category.delete({
        where: { id },
    });

    return deleted;
};

const categoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    updateCategoryInDB,
    deleteCategoryFromDB,
};

export default categoryService;