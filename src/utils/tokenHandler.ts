import jwt from 'jsonwebtoken';
import { UserDocument } from '../models/v1/User/userModel.ts';
import User from '../models/v1/User/userModel.ts';

/**
 * Generate access token and refresh token
 * @param user The user to generate tokens for
 * @returns An object with the access token and refresh token
 */
export function generateTokens(user: UserDocument): {
  accessToken: string;
  refreshToken: string;
} {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  const payload = {
    id: user._id,
    email: user.email,
    name: user.name,
    _id: user._id,
    roles: user.roles,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '2h',
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET);

  return { accessToken, refreshToken };
}

export const getUserFromToken = async (
  token: string
): Promise<UserDocument | null> => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET not defined');
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET) as UserDocument;
    if (!user) {
      throw new Error('Invalid token');
    }
    user = User.findOne({ _id: user._id });
  } catch (error) {
    throw error;
  }

  return user;
};
