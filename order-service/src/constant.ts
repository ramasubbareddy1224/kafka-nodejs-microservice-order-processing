
export const ERROR_TYPE = {
    VALIDATION: 'Validation Error',
    API: 'Api Error',
    JOI: 'Joi Error',
    DB: 'Database Error',
}
export const VALIDATION_ERROR_MSG = {
    IDEMPOTENCY_KEY_MISSING: 'Idempotency key is missing in the header',
    UNABLE_TO_CONNECT_KAFKA_BROKER: 'Unable to connect to kafka broker',
    DUPLICATE_ORDER: 'Order already created',
    UNABLE_TO_CREATE_ORDER: 'Unable to create order'
}

export const ORDER_STATUS = {
    PENDING: 'pending'
}
export const MAX_KAFKA_RETRIES = 5;

export const KAFKA_ORDER_TOPIC = 'order-topic';
