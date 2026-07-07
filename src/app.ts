import cookieParser from 'cookie-parser';
import express from 'express';
import type { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';
import router from './routes';

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

app.use('/api', router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;