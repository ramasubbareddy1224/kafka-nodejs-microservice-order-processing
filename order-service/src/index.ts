import { envConfig } from './env'
import { bootstrap } from './db/bootstrap';
import { Log } from './utils/logger';
import type { Application } from 'express';
import loadRoutes from './loadRoutes';
import App from './app';
import HandleError from './utils/handleError';
import { connectConsumer } from './utils/kafkaConnection';
import { KAFKA_PAYMENT_TOPIC } from './constant';
import { OrderProcess } from './services';

class OrderService {
    public app: Application;
    public port: number;
    private readonly orderSvc: OrderProcess = new OrderProcess();

    async start(): Promise<void> {

        await this.createApp();
        await this.initDBMigrations();
        process.env.HEALTH_STATUS = 'INITIALIZING ROUTES';
        loadRoutes(this.app);

        this.app.use(HandleError);
        await this.runKafaConsumer();
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

    async runKafaConsumer(): Promise<void> {
        const consumer = await connectConsumer();

        await consumer.subscribe({ topic: KAFKA_PAYMENT_TOPIC, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ message }) => {
                const order = JSON.parse(message.value.toString());
                console.log('Processing payment order details:', order);

                // check if payment already processed for the given order
                const idempotencyCheck = await this.orderSvc.checkPaymentProcess(order.order_id);
                if (idempotencyCheck) {
                    Log.info(`Payment status already updated for order ${order.order_id}`);
                    return;
                }
                // Store payment confirmation in MySQL
                await this.orderSvc.updatePaymentOrder({ id: order.order_id, status: order.status });
                Log.info(`Payment status updated for order ${order.order_id}`);
            }
        });
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

