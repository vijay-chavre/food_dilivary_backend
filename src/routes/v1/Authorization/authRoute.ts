import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';

import {
  refreshToken,
  signIn,
} from '../../../controllers/v1/User/authController';
import passport from '../../../passport/passport-config';
import { CustomError } from '../../../utils/errorhandler';
import User, { UserDocument } from '../../../models/v1/User/userModel';
const router = express.Router();

const checkUsernamePassword = async (
  req: Request,
  res: Response,
  done: NextFunction
) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new CustomError('Email and password are required', 400);
    }
    const user: UserDocument | null = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      throw new CustomError('Invalid email or password', 400);
    }
    if (!(await bcrypt.compare(req.body.password, user.password))) {
      throw new CustomError('Invalid password', 400);
    }

    req.user = user;

    done();
  } catch (error) {
    done(error);
  }
};

router.post('/signIn', checkUsernamePassword, signIn);

router.post('/refreshToken', refreshToken);

export default router;
