import type { Router, Request, Response } from 'express';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Log } from '../utils';

export default abstract class BaseRoute {
    public basePath: string = '';
    public router = express.Router();
    public abstract buildRoutes(): Router;
    public sendResponse(req: Request, res: Response, data: unknown, statusCode: number = StatusCodes.OK): Response {
        return res.status(statusCode).send({ success: true, data });
    }
    public sendErrorResponse(req: Request, res: Response, error: Error, msg: string = error.message, statusCode: number = StatusCodes.BAD_REQUEST): Response {
        const errorMessage = `Route ${req.originalUrl}:${req.method} error ${msg}`;
        Log.child({ message: error.message, stackTrace: error.stack }).error(errorMessage);
        return res.status(statusCode).send(error.message);
    }

}
