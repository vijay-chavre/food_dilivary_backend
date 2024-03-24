import express, { Request, Response, NextFunction } from 'express';
import {
  refreshToken,
  signIn,
} from '../../../controllers/v1/User/authController.ts';
import passport from '../../../passport/passport-config.ts';
import { CustomError } from '../../../utils/errorhandler.ts';
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
    done();
  } catch (error) {
    done(error);
  }
};

router.post(
  '/signIn',
  checkUsernamePassword,
  passport.authenticate('local'),
  signIn
);

router.post('/refreshToken', refreshToken);

export default router;
