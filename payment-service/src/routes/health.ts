import { StatusCodes } from 'http-status-codes';
import BaseRoute from './baseRoute';


class HealthRoute extends BaseRoute {
    public buildRoutes() {
        this.router.get('/ready', (req, res) => {
            try {
                const status = process.env.HEALTH_STATUS;
                this.sendResponse(req, res, status, status === 'READY' ? StatusCodes.OK : StatusCodes.EXPECTATION_FAILED);
            } catch (error) {
                this.sendErrorResponse(req, res, error);
                throw error;
            }
        });
        return this.router;
    }

}

export const healthRoutes = new HealthRoute().buildRoutes();
