import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import BaseRoute from './baseRoute';
import { AppError, JoiValidate, Log } from '../utils';
import OrderJoiSchema from '../joiValidation';
import { PaymentProcess } from '../services';
import { connectProducer } from '../utils/kafkaConnection';


class PaymentRoute extends BaseRoute {
    private readonly paymentSvc: PaymentProcess;
    constructor() {
        super();
        this.paymentSvc = new PaymentProcess();
    }
    public buildRoutes() {
        this.router.post('/', JoiValidate(OrderJoiSchema.createOrder), async (req: Request, res: Response, next: NextFunction) => {
            this.sendResponse(req, res, {success: true});
        });
        return this.router;
    }

}

export const paymentRoutes = new PaymentRoute().buildRoutes();
