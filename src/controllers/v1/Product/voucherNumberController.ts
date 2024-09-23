import VoucherNumber from '../../../models/v1/Product/voucherNumberModel';
import { asyncHandler } from '../../../utils/asyncHandler';
import { CustomError } from '../../../utils/errorhandler';
import sendSuccess from '../../../utils/sucessHandler';

export const getNextVoucherNumber = asyncHandler(async (req, res) => {
  const { type } = req.body;

  // check for type
  if (!type) {
    throw new CustomError('Type is required', 400);
  }
  const voucher = await VoucherNumber.findOneAndUpdate(
    { type },
    { $inc: { voucherNumber: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  sendSuccess(res, { nextVoucherNumber: voucher.voucherNumber }, 200);
});
