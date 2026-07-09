import type { RentalStatus } from '../../../generated/prisma/client';

export interface IUpdateOrderStatus {
    status: RentalStatus;
}