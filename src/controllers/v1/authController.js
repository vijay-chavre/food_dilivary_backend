import { asyncHandler } from '../../utils/asyncHandler.js';
import sendSuccess from '../../utils/sucessHandler.js';
import jwt from 'jsonwebtoken';

export const signIn = asyncHandler(async (req, res, next) => {
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
});
