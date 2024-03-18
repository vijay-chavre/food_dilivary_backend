import express from 'express';
import { signIn } from '../../../controllers/v1/authController.ts';
import passport from '../../../passport/passport-config.ts';
import { CustomError } from '../../../utils/errorhandler.ts';
const router = express.Router();

const checkUsernamePassword = async (req, res, done) => {
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

export default router;
