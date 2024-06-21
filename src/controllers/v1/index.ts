import * as chatController from './Chat/chatController';
import * as messageController from './Chat/messageController';
import * as userController from './User/userController';
import * as authController from './User/authController';
import * as roleController from './User/roleController';
import * as productController from './Product/productController';
import * as stockController from './Product/stockController';

const controllers = {
  ...chatController,
  ...messageController,
  ...userController,
  ...authController,
  ...roleController,
  ...productController,
  ...stockController,
};
export default controllers;
