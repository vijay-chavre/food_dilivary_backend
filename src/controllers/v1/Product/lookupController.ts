import Group from '../../../models/v1/Product/groupsModel';
import { asyncHandler } from '../../../utils/asyncHandler';
import { loadModel } from '../../../utils/moduleLoader';
import { attachPagination, buildQuery } from '../../../utils/paginatedResponse';
import sendSuccess from '../../../utils/sucessHandler';

export const lookups = asyncHandler(async (req, res, next) => {
  const { modelName } = req.params;

  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const Model = await loadModel(modelName);
  const group = await Model.find(query)
    .select('-__v')
    .populate('groupID', 'groupName')
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Group.countDocuments(query);
  const paginatedResponse = attachPagination(group, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});
