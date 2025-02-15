import { StatusCodes } from 'http-status-codes';

export type AppErrorType = {
    message: string;
    type?: string;
    statusCode?: number;
    error?: Error;
}
export class AppError extends Error {
    public statusCode = 500;
    public success = false;
    public type = 'Api Error';
    public innerError = null;

    constructor({ message, type = 'Api Error', statusCode = StatusCodes.BAD_REQUEST, error = null }: AppErrorType) {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.innerError = error;
    }

}
