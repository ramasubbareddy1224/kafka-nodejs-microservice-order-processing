import { envConfig } from './env'
import { bootstrap } from './db/bootstrap';
import { Log } from './utils/logger';
import type { Application } from 'express';
import loadRoutes from './loadRoutes';
import App from './app';
import HandleError from './utils/handleError';
import { connectConsumer, connectProducer } from './utils/kafkaConnection';
import { KAFKA_ORDER_TOPIC, KAFKA_PAYMENT_TOPIC, PAYMENT_STATUS } from './constant';
import { PaymentProcess } from './services';

class PaymentService {
    public app: Application;
    public port: number;
    private readonly paymentSvc: PaymentProcess = new PaymentProcess();


    async start(): Promise<void> {

        await this.createApp();
        await this.initDBMigrations();
        process.env.HEALTH_STATUS = 'INITIALIZING ROUTES';
        loadRoutes(this.app);

        this.app.use(HandleError);

        process.env.HEALTH_STATUS = 'READY';
        await this.runKafaConsumer();
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

        await consumer.subscribe({ topic: KAFKA_ORDER_TOPIC, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ message }) => {
                const order = JSON.parse(message.value.toString());
                console.log('Processing order details:', order);

                // check if payment already processed for the given order
                const idempotencyCheck = await this.paymentSvc.checkPaymentIdempotency(order.id);
                if (idempotencyCheck) {
                    Log.info(`Payment already processed for order ${order.id}`);
                    return;
                }

                const paymentConfirmation = { order_id: order.id, status: PAYMENT_STATUS.PAID };
                // Store payment confirmation in MySQL
                await this.paymentSvc.createPayment(paymentConfirmation);

                // send payment confirmation to Kafka Topic
                const producer = await connectProducer();
                await producer.send({
                    topic: KAFKA_PAYMENT_TOPIC,
                    messages: [{ value: JSON.stringify(paymentConfirmation) }]
                });
                Log.info(`Payment processed for order ${order.id}`);
            }
        });
    }
}

// Shutdown Hook
process.on('SIGTERM', () => {
    paymentSvc.app.set('HEALTH_STATUS', 'SHUTTING_DOWN');
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

const paymentSvc = new PaymentService();
Log.info('PaymentService api service: start the express server');
paymentSvc.start();

