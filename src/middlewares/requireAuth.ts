import { RequestHandler } from 'express';
import passport from 'passport';
import { UserDocument } from '../models/v1/User/userModel.ts';
import { CustomError } from '../utils/errorhandler.ts';

const requireAuth: RequestHandler = (req, res, next) => {
  passport.authenticate(
    'jwt',
    {
      session: false,
      failureMessage: 'Invalid token',
    },
    (error: Error | null, user?: UserDocument | false, info?: any) => {
      console.log(error, user, info);
      if (error || !user) {
        throw new CustomError(info, 401);
      }

      req.user = user;

      return next();
    }
  )(req, res, next);
};

export default requireAuth;
