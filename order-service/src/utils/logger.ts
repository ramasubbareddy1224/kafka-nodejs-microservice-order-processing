/* eslint-disable */
import pino from 'pino';
import { pinoHttp } from 'pino-http';
import { envConfig } from '../env';

const transport = ['dev', 'development'].includes(envConfig.NODE_ENV) ? { target: 'pino-pretty' } : null;

const pinoLogger = pino({
    name: envConfig.LOG_NAME,
    level: 'debug',
    enabled: envConfig.PINO_ENABLED,
    transport
})

export const LogMiddleware = pinoHttp({
    logger: pinoLogger
});

export const Log = LogMiddleware.logger;

