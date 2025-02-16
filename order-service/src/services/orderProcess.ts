import { AppError } from '../utils';
import knex from '../db/knex';
import { ERROR_TYPE, ORDER_STATUS } from '../constant';

export class OrderProcess {

    async createOrder(orderDetails: any) {
        try {
            return await knex('orders').insert(orderDetails).returning('id');
        }
        catch (error) {
            throw new AppError({ message: 'unable to createOrder', error, type: ERROR_TYPE.DB });
        }
    }

    async updatePaymentOrder(orderDetails: any) {
        try {
            return await knex('orders').where({ id: orderDetails.id }).update({ status: orderDetails.status });
        }
        catch (error) {
            throw new AppError({ message: 'unable to updatePaymentOrder', error, type: ERROR_TYPE.DB });
        }
    }

    async checkPaymentProcess(id: number) {
        try {
            const response = await knex('orders').where({ id, status: ORDER_STATUS.PAID });
            return response.length > 0;
        }
        catch (error) {
            throw new AppError({ message: 'unable to checkPaymentProcess', error, type: ERROR_TYPE.DB });
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
