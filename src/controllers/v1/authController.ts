import { asyncHandler } from '../../utils/asyncHandler.ts';
import sendSuccess from '../../utils/sucessHandler.ts';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export interface AuthenticatedRequest extends Request {
  user: User;
}

export const signIn = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as User;
  //Generate and return JWT token
  if (process.env.JWT_SECRET) {
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
        user: user,
      },
      200
    );
  }
});
