import { envConfig } from './env'
import { bootstrap } from './db/bootstrap';
import { Log } from './utils/logger';
import type { Application } from 'express';
import loadRoutes from './loadRoutes';
import App from './app';
import HandleError from './utils/handleError';


class OrderService {
    public app: Application;
    public port: number;


    async start(): Promise<void> {

        await this.createApp();
        await this.initDBMigrations();
        process.env.HEALTH_STATUS = 'INITIALIZING ROUTES';
        loadRoutes(this.app);

        this.app.use(HandleError);

        process.env.HEALTH_STATUS = 'READY';
        Log.info('Initialization successful. Service is Ready');
    }

    async createApp(): Promise<void> {
        const expressApp = new App();
        expressApp.init();
        this.app = expressApp.app;
        this.port = envConfig.PORT;
        await new Promise((resolve) => {
            this.app.listen(process.env.PORT, () => {
                Log.info(`Express App Started and listening at ${process.env.PORT}`);
                resolve(true);
            });
        });
    }

    async initDBMigrations(): Promise<void> {
        try {
            Log.info('Initializing initDBMigrations');
            await bootstrap.run();
            Log.info('Completed initDBMigrations');
        } catch (e) {
            Log.child({
                message: e.message,
                stack: e.stack
            }).error('Error bootstraping the DBMigrations.');
            this.app.set('HEALTH_STATUS', 'DB_MIGRATION_FAILED');
            throw e;
        }
    }
}

// Shutdown Hook
process.on('SIGTERM', () => {
    orderSvc.app.set('HEALTH_STATUS', 'SHUTTING_DOWN');
    process.exit(0);
});

// ['unhandledRejection', 'uncaughtException'].forEach(type => {
//     process.on(type, async (reason) => {
//         try {
//             console.log(`process.on ${type}, reason: ${reason}`);
//             process.exit(0)
//         } catch (_) {
//             process.exit(1)
//         }
//     })
// })

const orderSvc = new OrderService();
Log.info('OrderService api service: start the express server');
orderSvc.start();

