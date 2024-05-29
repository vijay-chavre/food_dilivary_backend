import userRoute from './User/userRoute';
import authRoute from './Authorization/authRoute';
import roleRoute from './User/roleRoutes';
import chatRoute from './Chat/chatRoutes';

const routes = [userRoute, authRoute, roleRoute, chatRoute];
export default routes;
