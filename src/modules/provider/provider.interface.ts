import type { RentalStatus } from '../../../generated/prisma/client';

export interface IUpdateOrderStatus {
    status: RentalStatus;
}

export interface ICreateGear {
    title: string;
    description: string;
    brand: string;
    pricePerDay: number;
    quantity?: number;
    images?: string[];
    categoryId: string;
}

export interface IUpdateGear {
    title?: string;
    description?: string;
    brand?: string;
    pricePerDay?: number;
    quantity?: number;
    isAvailable?: boolean;
    images?: string[];
    categoryId?: string;
}