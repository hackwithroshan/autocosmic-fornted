
import express, { Application, Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.handler';
import config from './config';
import { startCronJobs } from './services/cron.service';

dotenv.config();

const app: Application = express();
const port = config.port;

// Middleware
app.use(cors({
  origin: config.clientUrl,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Root endpoint
// FIX: Added explicit types for req and res
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'ZAINA COLLECTION Backend is running!' });
});


// Global Error Handler
// FIX: Cast errorHandler to ErrorRequestHandler to resolve overload issue.
app.use(errorHandler as ErrorRequestHandler);

// Start cron jobs for automated tasks
startCronJobs();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
