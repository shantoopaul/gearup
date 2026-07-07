import cookieParser from 'cookie-parser';
import express, { type Application, type Request, type Response } from 'express';
import cors from 'cors';
import config from './config';
import notFound from './middlewares/notFound';
import globalErrorHandler from './middlewares/globalErrorHandler';

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

app.use(notFound);
app.use(globalErrorHandler);

export default app;