import bcrypt from 'bcrypt';
import User from '../../models/v1/userModel.js';
import { CustomError } from '../../utils/errorhandler.js';
import sendSuccess from '../../utils/sucessHandler.js';
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const users = await User.find(query).skip(startIndex).limit(limit);
    const total = await User.countDocuments(query);
    let nextPage = page + 1;
    if (nextPage * limit > total) {
      nextPage = null;
    }
    const data = {
      users: users,
      currentPage: page,
      nextPage: nextPage,
      totalPages: Math.ceil(total / limit),
    };

    sendSuccess(res, data, 200);
  } catch (err) {
    next(err);
  }
};
export const createUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    const userPayload = {
      name: req.body.name,
      email: req.body.email,
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    userPayload.password = await bcrypt.hash(req.body.password, salt);

    const user = new User(userPayload);
    await user.save();
    sendSuccess(res, user, 201);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true }
    );

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    sendSuccess(res, user, 200);
  } catch (error) {
    next(error);
  }
};
