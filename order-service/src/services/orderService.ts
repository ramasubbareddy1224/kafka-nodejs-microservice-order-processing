import { AppError } from '../utils';
import knex from '../db/knex';
import { ERROR_TYPE } from '../constant';

export class OrderService {

    async createOrder(orderDetails: any) {
        try {
            return await knex('orders').insert(orderDetails).returning('id');
        }
        catch (error) {
            throw new AppError({ message: 'unable to createOrder', error, type: ERROR_TYPE.DB });
        }
    }
    async checkOrderIdempotency(idempotency_key: string) {
        try {
            const response = await knex('orders').where({ idempotency_key });
            return response.length > 0;
        }
        catch (error) {
            throw new AppError({ message: 'unable to checkOrderIdempotency', error, type: ERROR_TYPE.DB });
        }
    }
}
