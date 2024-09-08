import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Ledger, { ledgerSchema } from '../../../models/v1/Product/ledgerModel';
import Group from '../../../models/v1/Product/groupsModel';

import { attachPagination, buildQuery } from '../../../utils/paginatedResponse';

export const createLedger = asyncHandler(async (req, res, next) => {
  const validatedData = ledgerSchema.parse(req.body);

  const {
    ledgerName,
    groupID,
    alias,
    inventoryAffected,
    billByBill,
    taxDetails,
    narration,
    contactPerson,
    phone,
    email,
    website,
    openingBalance,
    maintainBalances,
    creditPeriod,
    checkForCreditDays,
    inventoryValuesAffected,
    address,
    country,
    state,
    pinCode,
    panItNo,
    gstNo,
    bankName,
    bankAccountNo,
    ifscCode,
    exciseDetails,
    vatDetails,
  } = validatedData;
  // Validated data from the request body
  const existingLedger = await Ledger.findOne({ ledgerName });
  if (existingLedger) {
    throw new CustomError('Ledger Already exist', 400);
  }

  // Check if the group exists
  const group = await Group.findById(groupID);
  if (!group) {
    throw new CustomError('Group Not exists', 400);
  }
  // Create the ledger
  const newLedger = new Ledger({
    ledgerName,
    groupID,
    alias,
    inventoryAffected,
    billByBill,
    taxDetails,
    narration,
    contactPerson,
    phone,
    email,
    website,
    openingBalance,
    maintainBalances,
    creditPeriod,
    checkForCreditDays,
    inventoryValuesAffected,
    address,
    country,
    state,
    pinCode,
    panItNo,
    gstNo,
    bankName,
    bankAccountNo,
    ifscCode,
    exciseDetails,
    vatDetails,
  });

  await newLedger.save();
  sendSuccess(res, newLedger, 200);
});

export const getLedgers = asyncHandler(async (req, res, next) => {
  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const group = await Ledger.find(query)
    .populate('groupID')
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Ledger.countDocuments(query);
  const paginatedResponse = attachPagination(group, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});
