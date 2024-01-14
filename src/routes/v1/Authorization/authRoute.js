import express from 'express';
import { signIn } from '../../../controllers/v1/authController.js';
import passport from '../../../passport/passport-config.js';
import { CustomError } from '../../../utils/errorhandler.js';
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

/**
 * @openAI
 * /signIn:
 *   get:
 *     description: Returns the homepage
 *     responses:
 *       200:
 *         description: hello world
 */
router.post(
  '/signIn',
  checkUsernamePassword,
  passport.authenticate('local'),
  signIn
);

export default router;
