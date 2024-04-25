import Role from '../../../models/v1/User/roleModel.ts';
import { CustomError } from '../../../utils/errorhandler.ts';
import sendSuccess from '../../../utils/sucessHandler.ts';
import { asyncHandler } from '../../../utils/asyncHandler.ts';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { UserDocument } from '../../../models/v1/User/userModel.ts';
import User from '../../../models/v1/User/userModel.ts';

export const getRoles: RequestHandler = asyncHandler(async (req, res, next) => {
  const roles = await Role.find();
  sendSuccess(res, roles, 200);
});

export const createRole: RequestHandler = asyncHandler(
  async (req, res, next) => {
    if (!req.body.name) {
      throw new CustomError('Role name is required', 400);
    }
    const rolePayload = {
      name: req.body.name,
      description: req.body.description,
    };
    const role = new Role(rolePayload);
    await role.save();
    sendSuccess(res, role, 201);
  }
);

export const assignRole: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const user = req.user as UserDocument;
    if (!user?.id) {
      throw new CustomError('User not found', 404);
    }
    const { roleId } = req.body;
    if (!roleId) {
      throw new CustomError('Role id is required', 400);
    }
    const role = await Role.findById(roleId);
    if (!role) {
      throw new CustomError('Role not found', 404);
    }
    user.roles = [...(user?.roles || []), roleId];
    // find and update user with new roles
    const userData = await User.findById(user._id);
    if (!userData) {
      throw new CustomError('User not found', 404);
    }
    userData.roles = user.roles;
    const updateUser = await userData.save();

    sendSuccess(res, updateUser, 200);
  }
);
