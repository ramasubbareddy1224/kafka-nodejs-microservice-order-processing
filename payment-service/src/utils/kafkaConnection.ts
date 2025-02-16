import { Kafka, Producer } from 'kafkajs';
import { AppError } from './AppError';
import { ERROR_TYPE, VALIDATION_ERROR_MSG } from '../constant';
import { envConfig } from '../env';

const kafka = new Kafka({
    clientId: 'payment-service',
    brokers: [envConfig.KAFKA_BROKER]
});

const producer: Producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'payment-service-group' });

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

export const connectConsumer = async () => {
    try {
        await consumer.connect();
        return consumer;
    } catch (error) {
        throw new AppError({ message: VALIDATION_ERROR_MSG.UNABLE_TO_CONNECT_KAFKA_BROKER, type: ERROR_TYPE.API });

    }
};
