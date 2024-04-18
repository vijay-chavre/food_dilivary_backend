import userRoute from './User/userRoute.ts';
import authRoute from './Authorization/authRoute.ts';
import roleRoute from './User/roleRoutes.ts';
import chatRoute from './Chat/chatRoutes.ts';

const routes = [userRoute, authRoute, roleRoute, chatRoute];
export default routes;
