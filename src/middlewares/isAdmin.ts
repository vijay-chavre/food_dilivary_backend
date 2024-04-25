// write miidlaware whic cheks for admin role

import { RequestHandler } from 'express';
import { UserDocument } from '../models/v1/User/userModel.ts';
import { CustomError } from '../utils/errorhandler.ts';

const isAdmin: RequestHandler = (req, res, next) => {
  const user = req.user as UserDocument;
  if (user?.roles) {
    console.log({ user });
    next();
  } else {
    next(new CustomError('Not authorized as an admin', 403));
  }
};

export default isAdmin;
