import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import categoryRoutes from '../modules/category/category.routes';
import gearRoutes from '../modules/gear/gear.routes';
import rentalRoutes from '../modules/rental/rental.routes';
import paymentRoutes from '../modules/payment/payment.routes';
import reviewRoutes from '../modules/review/review.routes';
import providerOrderRoutes from '../modules/provider/provider.routes';
import adminRoutes from '../modules/admin/admin.routes';

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
    {
        path: '/reviews',
        route: reviewRoutes,
    },
    {
        path: '/provider',
        route: providerOrderRoutes,
    },
    {
        path: '/admin',
        route: adminRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;