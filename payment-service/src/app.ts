/* eslint-disable */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export default class App {
    public app: express.Application;

    public init() {
        this.app = express();
        this.middleware();

    }
    private middleware(): void {
        this.app.use(helmet({ contentSecurityPolicy: false }));
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cors());
    }
}
