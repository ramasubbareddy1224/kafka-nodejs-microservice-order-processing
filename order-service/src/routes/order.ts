import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import BaseRoute from './baseRoute';
import { AppError, JoiValidate, Log } from '../utils';
import OrderJoiSchema from '../joiValidation';
import { ERROR_TYPE, KAFKA_ORDER_TOPIC, MAX_KAFKA_RETRIES, ORDER_STATUS, VALIDATION_ERROR_MSG } from '../constant';
import { OrderProcess } from '../services';
import { connectProducer } from '../utils/kafkaConnection';


class OrderRoute extends BaseRoute {
    private readonly orderSvc: OrderProcess;
    constructor() {
        super();
        this.orderSvc = new OrderProcess();
    }
    public buildRoutes() {
        this.router.post('/', JoiValidate(OrderJoiSchema.createOrder), async (req: Request, res: Response, next: NextFunction) => {
            let kafkaProducer;
            try {
                const idempotencyKey = req.headers['idempotency-key'] as string;
                // Check if idempotency key is present
                if (!idempotencyKey) {
                    throw new AppError({ message: VALIDATION_ERROR_MSG.IDEMPOTENCY_KEY_MISSING, type: ERROR_TYPE.VALIDATION });
                }
                // check if it is duplicate order
                const idempotencyCheck = await this.orderSvc.checkOrderIdempotency(idempotencyKey);
                if (idempotencyCheck) {
                    throw new AppError({ message: VALIDATION_ERROR_MSG.DUPLICATE_ORDER, type: ERROR_TYPE.VALIDATION });
                }
                kafkaProducer = await connectProducer();
                const orderDetails = { ...req.body, status: ORDER_STATUS.PENDING, idempotency_key: idempotencyKey };
                const orderResponse = await this.orderSvc.createOrder(orderDetails);
                orderDetails['id'] = orderResponse[0];
                // Send order to Kafka
                for (let attempt = 1; attempt <= MAX_KAFKA_RETRIES; attempt++) {
                    try {
                        await kafkaProducer.send({
                            topic: KAFKA_ORDER_TOPIC,
                            messages: [{ value: JSON.stringify(orderDetails) }]
                        });
                        break;
                    } catch (error) {
                        Log.error(`Trying ${attempt} to send order ${orderDetails.id} to Kafka failed:`, error);
                        if (attempt === MAX_KAFKA_RETRIES) {
                            Log.error(`Failed to send order ${orderDetails.id} to Kafka after ${MAX_KAFKA_RETRIES} attempts`, error);
                            throw new AppError({ message: VALIDATION_ERROR_MSG.UNABLE_TO_CREATE_ORDER, type: ERROR_TYPE.API });
                        } else {
                            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                        }
                    }
                }
                this.sendResponse(req, res, orderDetails);
            } catch (error) {
                next(error);
            } finally {
                if (kafkaProducer) {
                    await kafkaProducer.disconnect();
                }
            }
        });
        return this.router;
    }

}

export const orderRoutes = new OrderRoute().buildRoutes();
