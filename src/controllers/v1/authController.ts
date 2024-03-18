import { asyncHandler } from '../../utils/asyncHandler.ts';
import sendSuccess from '../../utils/sucessHandler.ts';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
interface AuthenticatedRequest extends Request {
  user: User;
}

export const signIn = asyncHandler(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;
    //Generate and return JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    sendSuccess(
      res,
      {
        token,
        user: req.user,
      },
      200
    );
  }
);
