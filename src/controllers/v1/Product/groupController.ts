import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Group from '../../../models/v1/Product/groupsModel';
import { attachPagination, buildQuery } from '../../../utils/paginatedResponse';

export const createGroup = asyncHandler(async (req, res, next) => {
  const { groupName, parentGroupID, nature, isPrimary, description } = req.body;

  const requiredFields = [groupName, nature];
  if (requiredFields.some((field) => !field)) {
    throw new CustomError(`Please fill all the fields`, 400);
  }
  const existingGroup = await Group.findOne({ groupName });
  if (existingGroup) {
    throw new CustomError('Group Already exists', 400);
  }
  const newGroup = new Group({
    groupName,
    parentGroupID: parentGroupID || null,
    nature,
    isPrimary,
    description: description || '',
  });

  await newGroup.save();
  sendSuccess(res, newGroup, 200);
});

export const createDefaultGroups = asyncHandler(async (req, res, next) => {
  // Check if the groups already exist
  const existingGroups = await Group.find({
    groupName: {
      $in: [
        'Purchase Accounts',
        'Sales Accounts',
        'Sundry Creditors',
        'Sundry Debtors',
      ],
    },
  });

  if (existingGroups.length > 0) {
    throw new CustomError('Default groups already exist', 400);
  }
  // Create Default Groups
  const purchaseGroup = new Group({
    groupName: 'Purchase Accounts',
    nature: 'Expenses',
    isPrimary: true,
  });

  const salesGroup = new Group({
    groupName: 'Sales Accounts',
    nature: 'Income',
    isPrimary: true,
  });

  const sundryCreditorsGroup = new Group({
    groupName: 'Sundry Creditors',
    nature: 'Liabilities',
    isPrimary: true,
  });

  const sundryDebtorsGroup = new Group({
    groupName: 'Sundry Debtors',
    nature: 'Assets',
    isPrimary: true,
  });

  // Save Groups to Database
  await Promise.all([
    purchaseGroup.save(),
    salesGroup.save(),
    sundryCreditorsGroup.save(),
    sundryDebtorsGroup.save(),
  ]);

  sendSuccess(
    res,
    [purchaseGroup, salesGroup, sundryCreditorsGroup, sundryDebtorsGroup],
    200
  );
});

export const getGroups = asyncHandler(async (req, res, next) => {
  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const group = await Group.find(query)
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Group.countDocuments(query);
  const paginatedResponse = attachPagination(group, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});
