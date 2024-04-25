import { RequestHandler } from 'express';
import { UserDocument } from '../models/v1/User/userModel.ts';
import { CustomError } from '../utils/errorhandler.ts';
import Role from '../models/v1/User/roleModel.ts';

const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as UserDocument;

  if (!user) {
    return next(new CustomError('Not authorized as admin', 403));
  }

  const adminRole = await Role.findOne({ name: 'admin' });

  if (!adminRole) {
    return next(new CustomError('Admin role not found', 500));
  }

  if (!user.roles?.includes(adminRole._id.toString())) {
    return next(new CustomError('Not authorized as admin', 403));
  }

  next();
};

export default isAdmin;
