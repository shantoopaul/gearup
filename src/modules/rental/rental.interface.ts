export interface ICreateRentalOrder {
    gearItemId: string;
    startDate: string;
    endDate: string;
    quantity?: number;
}