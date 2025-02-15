import Joi from 'joi';

export default {
    createOrder: Joi.object({
        customer_name: Joi.string().required(),
        product_id: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required(),
        total_amount: Joi.number().positive().required()
    })
}
