import knex from './knex';
import { Log } from '../utils/logger';

export class Bootstrap {
    async run(): Promise<void> {
        await this.waitForDatabase();
        await this.runMigrations();
    }

    async waitForDatabase() {
        let retries = 0;
        const MAX_RETRIES = 10;
        while (retries < MAX_RETRIES) {
            try {
                Log.info('connection db...');
                await knex.raw('select 1');
                return true;
            } catch (error) {
                console.log('error', error);
                retries += 1;
                Log.info('Failed to connect to MySQL. Retrying..!', error.message);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        throw new Error('Unable to connect to db after max retries');
    }

    async runMigrations(): Promise<void> {
        try {
            Log.info('running migrations');
            await knex.migrate.latest();
            Log.info('running migrations complete.');
        } catch (err) {
            Log.error({
                errorMessage: err.message,
                errorStack: err.stack
            }, 'running migrations failed');
            throw err;
        }
    }
}

export const bootstrap = new Bootstrap();
