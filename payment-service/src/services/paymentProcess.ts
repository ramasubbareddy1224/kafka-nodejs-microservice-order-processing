import { AppError } from '../utils';
import knex from '../db/knex';
import { ERROR_TYPE } from '../constant';

export class PaymentProcess {

    async createPayment(paymentDetails: any) {
        try {
            const [insertedId] = await knex('payments').insert(paymentDetails);
            return insertedId;
        }
        catch (error) {
            throw new AppError({ message: 'unable to createPayment', error, type: ERROR_TYPE.DB });
        }
    }
    async checkPaymentIdempotency(order_id: number) {
        try {
            const response = await knex('payments').where({ order_id });
            return response.length > 0;
        }
        catch (error) {
            throw new AppError({ message: 'unable to checkPaymentIdempotency', error, type: ERROR_TYPE.DB });
        }
    }
}
