import jwt from 'jsonwebtoken';

type User = {
  id: string;
};

/**
 * Generate access token and refresh token
 * @param user The user to generate tokens for
 * @returns An object with the access token and refresh token
 */
export function generateTokens(user: { id: string }): {
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

export const getUserFromToken = async (token: string): Promise<User> => {
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
