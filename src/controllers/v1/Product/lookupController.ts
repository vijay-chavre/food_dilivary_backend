import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Group from '../../../models/v1/Product/groupsModel';
import Ledger from '../../../models/v1/Product/ledgerModel';
import { attachPagination, buildQuery } from '../../../utils/paginatedResponse';
import { loadModel } from '../../../utils/moduleLoader';

export const lookups = asyncHandler(async (req, res, next) => {
  const { modelName } = req.params;

  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const Model = await loadModel(modelName);
  const group = await Model.find(query)
    .select('-__v') // Exclude the __v field
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Group.countDocuments(query);
  const paginatedResponse = attachPagination(group, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});
