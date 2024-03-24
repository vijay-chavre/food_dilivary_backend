import { asyncHandler } from '../../../utils/asyncHandler.ts';
import sendSuccess from '../../../utils/sucessHandler.ts';
import jwt from 'jsonwebtoken';
import { Request, RequestHandler, Response } from 'express';
import { CustomError } from '../../../utils/errorhandler.ts';
type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};
export interface AuthenticatedRequest extends Request {
  user: User;
}

/**
 * Generate access token and refresh token
 * @param user The user to generate tokens for
 * @returns An object with the access token and refresh token
 */
function generateTokens(user: { id: string }): {
  accessToken: string;
  refreshToken: string;
} {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  } as jwt.SignOptions);

  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  return { accessToken, refreshToken };
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

const getUserFromToken = async (token: string): Promise<User> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET) as User;
  } catch (error) {
    throw error;
  }

  return user;
};

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
