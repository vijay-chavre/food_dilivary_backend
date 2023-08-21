
import { CustomError } from "../../utils/errorhandler.js";
import User from "../../models/v1/userModel.js";
import bcrypt from "bcrypt";
import sendSuccess from "../../utils/sucessHandler.js";
export const signIn = async(req, res, next) => {
  try {
    // Validate request
    if(!req.body.email || !req.body.password) {
      throw new CustomError('Email and password are required' , 400);
    }

    // Find user by email
    const user = await User.findOne({email: req.body.email});

    if(!user) {
      throw new CustomError('Invalid credentials', 400);
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if(!isPasswordValid) {
      throw new CustomError('Invalid Password', 400);
    }

    // Generate and return JWT token
    // const token = jwt.sign({
    //   id: user._id,
    //   email: user.email
    // }, process.env.JWT_SECRET, {expiresIn: '1h'});

    const token = 'token ....data'


    sendSuccess(res, {
      token,
      user: user
    }, 200)
  

  } catch (err) {
    next(err);
  }
}