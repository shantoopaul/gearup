import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import categoryRoutes from '../modules/category/category.routes';
import gearRoutes from '../modules/gear/gear.routes';
import rentalRoutes from '../modules/rental/rental.routes';
import paymentRoutes from '../modules/payment/payment.routes';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/categories',
        route: categoryRoutes,
    },
    {
        path: '/gear',
        route: gearRoutes,
    },
    {
        path: '/rentals',
        route: rentalRoutes,
    },
    {
        path: '/payments',
        route: paymentRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;