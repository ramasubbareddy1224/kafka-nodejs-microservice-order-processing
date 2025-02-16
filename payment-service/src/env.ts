import { config } from 'dotenv';
import { cleanEnv, str, num, bool } from 'envalid';

// copy .env variables to process.env in non-production environment
const env = process.env.NODE_ENV
if (env !== 'production') {
    config();
}

const envVar = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['dev', 'development', 'test', 'production'] }),
    PORT: num(),
    LOG_NAME: str(),
    PINO_ENABLED: bool(),
    MYSQL_HOST: str(),
    MYSQL_PORT: num(),
    MYSQL_DATABASE: str(),
    MYSQL_USER: str(),
    MYSQL_PASSWORD: str(),
    KAFKA_BROKER: str()
})


export const envConfig = {
    NODE_ENV: envVar.NODE_ENV,
    PORT: envVar.PORT,
    LOG_NAME: envVar.LOG_NAME,
    PINO_ENABLED: envVar.PINO_ENABLED,
    MYSQL_HOST: envVar.MYSQL_HOST,
    MYSQL_PORT: envVar.MYSQL_PORT,
    MYSQL_DATABASE: envVar.MYSQL_DATABASE,
    MYSQL_USER: envVar.MYSQL_USER,
    MYSQL_PASSWORD: envVar.MYSQL_PASSWORD,
    KAFKA_BROKER: envVar.KAFKA_BROKER
}
