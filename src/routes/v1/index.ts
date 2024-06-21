import userRoute from './User/userRoute';
import authRoute from './Authorization/authRoute';
import roleRoute from './User/roleRoutes';
import chatRoute from './Chat/chatRoutes';
import uploadRoute from './Upload/uploadRoutes';
import productRoute from './Product/productRoutes';

const routes = [
  userRoute,
  authRoute,
  roleRoute,
  chatRoute,
  uploadRoute,
  productRoute,
];
export default routes;
