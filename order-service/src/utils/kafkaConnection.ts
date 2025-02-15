import { Kafka, Producer } from 'kafkajs';
import { AppError } from './AppError';
import { ERROR_TYPE, VALIDATION_ERROR_MSG } from '../constant';

const kafka = new Kafka({
    clientId: 'order-service',
    brokers: ['localhost:29092']
});

const producer: Producer = kafka.producer();

export const connectProducer = async (): Promise<Producer> => {
    try {
        await producer.connect();
        return producer;

    } catch (error) {
        throw new AppError({ message: VALIDATION_ERROR_MSG.UNABLE_TO_CONNECT_KAFKA_BROKER, type: ERROR_TYPE.API });
    }

};

export const disconnectProducer = async (): Promise<void> => {
    await producer.disconnect();
};
