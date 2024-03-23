import Role from '../../models/v1/User/roleModel.ts';
import { CustomError } from '../../utils/errorhandler.ts';
import sendSuccess from '../../utils/sucessHandler.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { Request, Response, NextFunction } from 'express';

export const getRoles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const roles = await Role.find();
    sendSuccess(res, roles, 200);
  }
);

export const createRole = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
