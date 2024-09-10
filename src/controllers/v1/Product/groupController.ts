import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Group from '../../../models/v1/Product/groupsModel';
import Ledger from '../../../models/v1/Product/ledgerModel';
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

export const createDefaultGroupsOld = asyncHandler(async (req, res, next) => {
  const defaultGroups = [
    { groupName: 'Sundry Debtors', nature: 'Assets' },
    { groupName: 'Bank Accounts', nature: 'Assets' },
    { groupName: 'Cash-in-Hand', nature: 'Assets' },
    { groupName: 'Stock-in-Hand', nature: 'Assets' },
    { groupName: 'Deposits', nature: 'Assets' },
    { groupName: 'Sundry Creditors', nature: 'Liabilities' },
    { groupName: 'Taxes', nature: 'Liabilities' },
    { groupName: 'Suspense Accounts', nature: 'Liabilities' },
    { groupName: 'Sales Accounts', nature: 'Income' },
    { groupName: 'Purchase Accounts', nature: 'Expenses' },
  ];

  const createdGroups = [];

  for (const group of defaultGroups) {
    const existingGroup = await Group.findOne({ groupName: group.groupName });
    if (!existingGroup) {
      const newGroup = await Group.create({
        ...group,
        isPrimary: true,
      });
      createdGroups.push(newGroup);
    }
  }

  // Create default ledgers after groups are created
  const defaultLedgers = [
    {
      ledgerName: 'Cash A/c',
      groupName: 'Cash-in-Hand',
      alias: 'Cash A/c',
      narration: 'Total Cash in Hand Account of Company',
      inventoryValuesAffected: false,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
    {
      ledgerName: 'Bank A/c',
      groupName: 'Bank Accounts',
      alias: 'Bank A/c',
      narration: 'Total Cash In Bank Revenue Account of Company',
      inventoryValuesAffected: false,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
    {
      ledgerName: 'Sales A/c',
      groupName: 'Sales Accounts',
      alias: 'Sales A/c',
      narration: 'Sales Revenue Account of Company',
      inventoryValuesAffected: true,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
    {
      ledgerName: 'Purchase A/c',
      groupName: 'Purchase Accounts',
      alias: 'Purchase A/c',
      narration: 'Purchase Revenue Account of Company',
      inventoryAffected: true,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
  ];
  const createdLedgers = [];

  for (const ledger of defaultLedgers) {
    const group = await Group.findOne({ groupName: ledger.groupName });
    if (group) {
      const existingLedger = await Ledger.findOne({ name: ledger.ledgerName });
      if (!existingLedger) {
        const newLedger = await Ledger.create({
          ledgerName: ledger.ledgerName,
          alias: ledger.alias,
          narration: ledger.narration,
          inventoryValuesAffected: ledger.inventoryValuesAffected,
          openingBalance: ledger.openingBalance,
          maintainBalances: ledger.maintainBalances,
          billByBill: ledger.billByBill,
          groupID: group._id,
        });
        createdLedgers.push(newLedger);
      }
    }
  }

  sendSuccess(res, { createdGroups, createdLedgers }, 200);
});

export const createDefaultGroups = asyncHandler(async (req, res, next) => {
  const defaultGroups = [
    { groupName: 'Sundry Debtors', nature: 'Assets' },
    { groupName: 'Bank Accounts', nature: 'Assets' },
    { groupName: 'Cash-in-Hand', nature: 'Assets' },
    { groupName: 'Stock-in-Hand', nature: 'Assets' },
    { groupName: 'Deposits', nature: 'Assets' },
    { groupName: 'Sundry Creditors', nature: 'Liabilities' },
    { groupName: 'Taxes', nature: 'Liabilities' },
    { groupName: 'Suspense Accounts', nature: 'Liabilities' },
    { groupName: 'Sales Accounts', nature: 'Income' },
    { groupName: 'Purchase Accounts', nature: 'Expenses' },
  ];

  // Find existing groups and filter out the ones that are not in the DB
  const existingGroups = await Group.find({
    groupName: { $in: defaultGroups.map((group) => group.groupName) },
  });

  const existingGroupNames = existingGroups.map((group) => group.groupName);
  const groupsToCreate = defaultGroups.filter(
    (group) => !existingGroupNames.includes(group.groupName)
  );

  // Create new groups only for non-existing ones
  let createdGroups: any[] = [];
  if (groupsToCreate.length > 0) {
    createdGroups = await Group.insertMany(
      groupsToCreate.map((group) => ({ ...group, isPrimary: true }))
    );
  }

  // Create default ledgers after groups are created
  const defaultLedgers = [
    {
      ledgerName: 'Cash A/c',
      groupName: 'Cash-in-Hand',
      alias: 'Cash A/c',
      narration: 'Total Cash in Hand Account of Company',
      inventoryValuesAffected: false,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
    {
      ledgerName: 'Bank A/c',
      groupName: 'Bank Accounts',
      alias: 'Bank A/c',
      narration: 'Total Cash In Bank Revenue Account of Company',
      inventoryValuesAffected: false,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
    {
      ledgerName: 'Sales A/c',
      groupName: 'Sales Accounts',
      alias: 'Sales A/c',
      narration: 'Sales Revenue Account of Company',
      inventoryValuesAffected: true,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
    {
      ledgerName: 'Purchase A/c',
      groupName: 'Purchase Accounts',
      alias: 'Purchase A/c',
      narration: 'Purchase Revenue Account of Company',
      inventoryAffected: true,
      openingBalance: 0,
      maintainBalances: true,
      billByBill: false,
    },
  ];

  // Fetch the required groups for ledgers in one query
  const ledgerGroupNames = defaultLedgers.map((ledger) => ledger.groupName);
  const ledgerGroups = await Group.find({
    groupName: { $in: ledgerGroupNames },
  });

  const createdLedgers = [];

  for (const ledger of defaultLedgers) {
    const group = ledgerGroups.find((g) => g.groupName === ledger.groupName);
    if (group) {
      const existingLedger = await Ledger.findOne({
        ledgerName: ledger.ledgerName,
      });
      if (!existingLedger) {
        const newLedger = await Ledger.create({
          ledgerName: ledger.ledgerName,
          alias: ledger.alias,
          narration: ledger.narration,
          inventoryValuesAffected: ledger.inventoryValuesAffected,
          openingBalance: ledger.openingBalance,
          maintainBalances: ledger.maintainBalances,
          billByBill: ledger.billByBill,
          groupID: group._id,
        });
        createdLedgers.push(newLedger);
      }
    }
  }

  // Return the result
  sendSuccess(res, { createdGroups, createdLedgers }, 200);
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
