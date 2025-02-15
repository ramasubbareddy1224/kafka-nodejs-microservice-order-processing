import { healthRoutes, orderRoutes } from './routes';

export const LoadRoutes = (app) => {
    app.use('/v1/health', healthRoutes);
    app.use('/v1/order', orderRoutes);
}
export default LoadRoutes;
