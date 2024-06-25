import bcrypt from 'bcrypt';
import User from '../../../models/v1/User/userModel';
import { CustomError } from '../../../utils/errorhandler';
import sendSuccess from '../../../utils/sucessHandler';
import { s3 } from '../../../services/awsService';
import { asyncHandler } from '../../../utils/asyncHandler';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { attachPagination } from '../../../utils/paginatedResponse';

export const getUsers: RequestHandler = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page as unknown as string) || 1;
  const limit = parseInt(req.query.limit as unknown as string) || 10;
  const search = (req.query.search as unknown as string) || '';

  const startIndex = (page - 1) * limit;

  let query = {};
  if (search) {
    query = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    };
  }
  const users = await User.find(query)
    // .populate('roles', { id: 1, name: 1 })
    .skip(startIndex)
    .limit(limit);
  const total = await User.countDocuments(query);

  const paginatedResponse = attachPagination(users, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});

export const createUser: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      throw new CustomError('User already exists', 400);
    }

    const userPayload = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Hash password
    const salt = await bcrypt.genSalt(10);
    userPayload.password = await bcrypt.hash(req.body.password, salt);

    const user = new User(userPayload);
    await user.save();
    sendSuccess(res, user, 201);
  }
);

export const updateUser: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Check if email was changed
    if (req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        throw new CustomError('Email already in use', 400);
      }
    }

    // Hash password if it was changed
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    // Update user document
    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    sendSuccess(res, updatedUser, 200);
  }
);
export const getUserById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    sendSuccess(res, user, 200);
  }
);
export const assignRoleToUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.user);
  }
);

// delete All users

// delete All users
export const deleteAllUsers: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const deletedUsers = await User.deleteMany({});
    sendSuccess(res, deletedUsers, 200);
  }
);

export const listS3: RequestHandler = asyncHandler(async (req, res, next) => {
  const s3Bucket = await s3();
  const data = await s3Bucket.listBuckets().promise();
  sendSuccess(res, data, 200);
});
