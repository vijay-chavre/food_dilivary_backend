import userRoute from './User/userRoute.ts';
import authRoute from './Authorization/authRoute.ts';
import roleRoute from './User/roleRoutes.ts';

const routes = [userRoute, authRoute, roleRoute];
export default routes;
