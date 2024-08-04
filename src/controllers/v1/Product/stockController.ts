import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Product from '../../../models/v1/Product/productModel';
import Stock from '../../../models/v1/Product/stockItemModel';
import Supplier from '../../../models/v1/Product/supplierModel';
import { calculateGSTForItem } from '../../../utils/gstUtils';
import { attachPagination, buildQuery } from '../../../utils/paginatedResponse';

// write utl that checks json fields validation and empty or undefined

// Product Routes
export const createStockItem = asyncHandler(async (req, res, next) => {
  const {
    productId,
    supplierId,
    voucherId,
    quantity,
    expiryDate,
    lotNumber,
    manufacturingDate,
    gst,
    rate,
    minRate,
    maxRate,
  } = req.body;
  // product is required
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError('Product is required', 400);
  }

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    throw new CustomError('Supplier is required', 400);
  }

  const requiredFields = [quantity, gst, rate, expiryDate, lotNumber];
  if (requiredFields.some((field) => !field)) {
    throw new CustomError(`Please fill all the fields`, 400);
  }

  // check if stock exists
  const stock = await Stock.findOne({
    product: productId,
    lotNumber: lotNumber,
  });
  if (stock) {
    throw new CustomError('Stock already exists', 400);
  }

  const {
    preGSTAmount,
    postGSTAmount,
    cgstRate,
    sgstRate,
    GSTAmount,
    CGSTAmount,
    SGSTAmount,
  } = calculateGSTForItem(quantity, rate, gst);
  const newStock = new Stock({
    product: productId,
    supplier: supplierId,
    voucher: voucherId,
    quantity,
    expiryDate,
    lotNumber,
    manufacturingDate,
    rate,
    gst: {
      gstRate: gst,
      cgstRate: cgstRate,
      sgstRate: sgstRate,
      gstAmount: GSTAmount,
      cgstAmount: CGSTAmount,
      sgstAmount: SGSTAmount,
      preGstAmount: preGSTAmount,
      postGstAmount: postGSTAmount,
    },

    maxRate,
    minRate,
  });

  await newStock.save();

  sendSuccess(res, newStock, 200);
});

export const getStockItems = asyncHandler(async (req, res, next) => {
  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const supplier = await Stock.find(query)
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Stock.countDocuments(query);
  const paginatedResponse = attachPagination(supplier, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});
