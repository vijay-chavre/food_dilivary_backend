import userRoute from './User/userRoute';
import authRoute from './Authorization/authRoute';
import roleRoute from './User/roleRoutes';
import chatRoute from './Chat/chatRoutes';
import uploadRoute from './Upload/uploadRoutes';

const routes = [userRoute, authRoute, roleRoute, chatRoute, uploadRoute];
export default routes;
