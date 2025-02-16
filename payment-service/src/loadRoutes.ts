import { healthRoutes, paymentRoutes } from './routes';

export const LoadRoutes = (app) => {
    app.use('/v1/health', healthRoutes);
    app.use('/v1/payment', paymentRoutes);
}
export default LoadRoutes;
