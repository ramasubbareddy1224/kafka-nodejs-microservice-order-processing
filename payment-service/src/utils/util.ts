import * as UUID from 'uuid';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectSchema } from 'joi';
import { AppError } from './AppError';
import { ERROR_TYPE } from '../constant';
import { StatusCodes } from 'http-status-codes';

export const generateNewUUID = (): string => {
    return UUID.v4();
}

export const JoiValidate = (schema: ObjectSchema<unknown>, prop: string = 'body'): RequestHandler => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[prop], { abortEarly: false });
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            throw new AppError({ message, type: ERROR_TYPE.JOI, statusCode: StatusCodes.UNPROCESSABLE_ENTITY });
        }
        else {
            next();
        }
    }
}
