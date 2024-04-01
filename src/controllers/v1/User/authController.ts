import { asyncHandler } from '../../../utils/asyncHandler.ts';
import sendSuccess from '../../../utils/sucessHandler.ts';
import { Request, RequestHandler, Response } from 'express';
import { CustomError } from '../../../utils/errorhandler.ts';
import {
  generateTokens,
  getUserFromToken,
} from '../../../utils/tokenHandler.ts';
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export interface AuthenticatedRequest extends Request {
  user: User;
}

export const signIn: RequestHandler = asyncHandler(async (req, res) => {
  const user = req.user as User;
  //Generate and return JWT token
  if (process.env.JWT_SECRET) {
    const { accessToken, refreshToken } = generateTokens(user);

    sendSuccess(
      res,
      {
        accessToken,
        refreshToken,
        user: user,
      },
      200
    );
  }
});

export const refreshToken: RequestHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    throw new CustomError('Refresh token is required', 400);
  }
  if (!process.env.JWT_SECRET) {
    throw new CustomError('JWT_SECRET not defined', 500);
  }
  const user = await getUserFromToken(refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

  sendSuccess(
    res,
    {
      accessToken,
      refreshToken: newRefreshToken,
    },
    200
  );
});
