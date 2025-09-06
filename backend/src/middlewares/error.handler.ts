
// FIX: Added explicit imports for Express types.
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface CustomError extends Error {
    statusCode?: number;
}

// FIX: Changed signature from ErrorRequestHandler alias to explicit types
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on the server.';
    
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
};
