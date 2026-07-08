export interface ICreateGear {
    title: string;
    description: string;
    brand: string;
    pricePerDay: number;
    quantity?: number;
    images?: string[];
    categoryId: string;
}

export interface IGearFilters {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}