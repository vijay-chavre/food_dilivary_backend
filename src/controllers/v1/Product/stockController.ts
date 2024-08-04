import { CustomError } from '../../../utils/errorhandler';
import { asyncHandler } from '../../../utils/asyncHandler';
import sendSuccess from '../../../utils/sucessHandler';
import Product from '../../../models/v1/Product/productModel';
import Stock from '../../../models/v1/Product/stockItemModel';

// write utl that checks json fields validation and empty or undefined

// Product Routes
export const createStock = asyncHandler(async (req, res, next) => {
  const {
    productId,
    quantity,
    price,
    expiryDate,
    lotNumber,
    manufacturingDate,
    gstRate,
  } = req.body;
  // product is required
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError('Product is required', 400);
  }
  if ([quantity, price, expiryDate, lotNumber].some((field) => !field)) {
    throw new CustomError('Please fill all the fields', 400);
  }

  // check if stock exists
  const stock = await Stock.findOne({
    product: productId,
    lotNumber: lotNumber,
  });
  if (stock) {
    throw new CustomError('Stock already exists', 400);
  }
  // create stock
  const newStock = new Stock({
    product: productId,
    quantity,
    price,
    expiryDate,
    lotNumber,
    manufacturingDate,
    gstRate,
  });

  await newStock.save();

  sendSuccess(res, newStock, 200);
});
