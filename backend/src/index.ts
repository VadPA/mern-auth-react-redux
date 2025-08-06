import express, {
  json,
  urlencoded,
  NextFunction,
  Request,
  Response,
} from 'express';
import userRoutes from './routes/auth/index';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// import { connectionDB } from './config/db';
// import './config/db'
import dbClient from './config/dbClient';
import ErrorHandler from './utils/ErrorHandler';
import { ErrorMiddleware } from './middleware/error';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || ''],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(json());

// const db = process.env.DB;

// mongoose.connect(db as string).then(() => {
//   console.log('DB connection successfully');
// });

// User api urls
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world!');
});

app.use('/api/v1/user', userRoutes);

// app.all('*', (req: Request, res: Response, next: NextFunction) => {
//   const err = new Error(`Route ${req.originalUrl} not found`) as any;
//   err.statusCode = 404;
//   err.name = '';
//   next(err);
// });

app.use(ErrorMiddleware);

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
});

process.on('SIGINT', async () => {
  dbClient.closeConnect();
  process.exit(0);
});
