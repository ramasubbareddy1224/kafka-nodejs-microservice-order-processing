import Knex from 'knex';
import { envConfig } from '../env';

export default Knex({
    client: 'mysql2',
    connection: {
        host: envConfig.MYSQL_HOST,
        port: envConfig.MYSQL_PORT,
        user: envConfig.MYSQL_USER,
        password: envConfig.MYSQL_PASSWORD,
        database: envConfig.MYSQL_DATABASE,
    },
    migrations: { tableName: 'orders_knex_migrations', directory: `${__dirname}/migrations` },
    pool: { min: 2, max: 5 }
});
