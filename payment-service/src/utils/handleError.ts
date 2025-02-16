import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';
import { Log } from './logger';

export const HandleError = (
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    if (error) {
        const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
        const errorType = error.type || 'Api Error';
        const success = error.success || false;
        const errorMessage = `Route ${req.originalUrl}:${req.method} error type: ${errorType} message: ${error.message}`;
        Log.child({ message: error.innerError?.message || error.message, stackTrace: error.innerError?.stack || error.stack }).error(errorMessage);
        res.status(statusCode).send({ success, message: error.message, type: errorType });
    }
    next();
};

export default HandleError;
