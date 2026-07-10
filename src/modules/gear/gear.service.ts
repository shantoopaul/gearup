import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import type { Prisma } from '../../../generated/prisma/client';
import type { IGearFilters } from './gear.interface';

const gearSortableFields = ['title', 'brand', 'pricePerDay', 'createdAt'] as const;
type GearSortableField = (typeof gearSortableFields)[number];

const getAllGearsFromDB = async (filters: IGearFilters) => {
    const { category, brand, minPrice, maxPrice, search } = filters;

    // pagination
    const page = filters.page ? Number(filters.page) : 1;
    const limit = filters.limit ? Number(filters.limit) : 10;
    const skip = (page - 1) * limit;

    // sorting
    const sortBy: GearSortableField = gearSortableFields.includes(
        filters.sortBy as GearSortableField
    )
        ? (filters.sortBy as GearSortableField)
        : 'createdAt';
    const sortOrder: Prisma.SortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

    const andConditions: Prisma.GearItemWhereInput[] = [{ isAvailable: true }];

    if (search) {
        andConditions.push({
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ],
        });
    }

    if (category) {
        andConditions.push({
            category: { name: { equals: category, mode: 'insensitive' } },
        });
    }

    if (brand) {
        andConditions.push({ brand: { equals: brand, mode: 'insensitive' } });
    }

    if (minPrice || maxPrice) {
        andConditions.push({
            pricePerDay: {
                ...(minPrice && { gte: Number(minPrice) }),
                ...(maxPrice && { lte: Number(maxPrice) }),
            },
        });
    }

    const whereConditions: Prisma.GearItemWhereInput = { AND: andConditions };

    const gears = await prisma.gearItem.findMany({
        where: whereConditions,
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            category: true,
        },
    });

    const total = await prisma.gearItem.count({ where: whereConditions });

    return {
        data: gears,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const getSingleGearFromDB = async (id: string) => {
    const gear = await prisma.gearItem.findUnique({
        where: { id },
        include: {
            category: true,
            provider: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    if (!gear) {
        throw new AppError(httpStatus.NOT_FOUND, 'Gear  not found');
    }

    return gear;
};

const gearService = {
    getAllGearsFromDB,
    getSingleGearFromDB,
};

export default gearService;