import Ledger from '../../../models/v1/Product/ledgerModel';
import Product from '../../../models/v1/Product/productModel';
import Voucher, {
  IVoucher,
  VoucherSchemaValidation,
} from '../../../models/v1/Product/voucherModel';
import { asyncHandler } from '../../../utils/asyncHandler';
import { CustomError } from '../../../utils/errorhandler';
import { attachPagination, buildQuery } from '../../../utils/paginatedResponse';
import sendSuccess from '../../../utils/sucessHandler';

// Handler for sales voucher type

const handleSalesVoucher = async (items: IVoucher['items']) => {
  if (!items || items.length === 0) {
    throw new CustomError('Sales Order is not valid', 400);
  }

  // Fetch all products in a single query
  const itemNames = items.map((item) => item.itemName);
  const products = await Product.find({ name: { $in: itemNames } });

  // Create a map of product names to product documents for easy lookup
  const productMap = new Map(
    products.map((product) => [product.name, product])
  );
  const missingItemNames = itemNames.filter(
    (itemName) => !productMap.has(itemName)
  );

  if (missingItemNames.length > 0) {
    throw new CustomError(
      `Stock Items with Names ${missingItemNames.join(', ')} not found`,
      400
    );
  }

  // Use transactions to ensure atomicity
  const session = await Product.startSession();
  session.startTransaction();

  try {
    // Process items and update quantities and batches
    for (const item of items) {
      const itemDocument = productMap.get(item.itemName)!;

      // Check if there's enough quantity to fulfill the sales order
      if (itemDocument.quantity < item.quantity) {
        throw new CustomError(
          `Insufficient quantity for item ${item.itemName}`,
          400
        );
      }

      // Deduct product quantity
      itemDocument.quantity -= item.quantity;

      // Update or validate batch
      if (item.batch) {
        const existingBatch = itemDocument.batches.find(
          (batch) => batch.batchNo === item.batch
        );
        if (existingBatch) {
          if (existingBatch.quantity < item.quantity) {
            throw new CustomError(
              `Insufficient batch quantity for item ${item.itemName} in batch ${item.batch} available quantity ${existingBatch.quantity}`,
              400
            );
          }
          existingBatch.quantity -= item.quantity;
        } else {
          throw new CustomError(
            `Batch ${item.batch} not found for item ${item.itemName}`,
            400
          );
        }
      }

      await itemDocument.save({ session });
    }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
  } catch (error) {
    // Rollback the transaction if any operation fails
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const handlePurchaseVoucher = async (items: IVoucher['items']) => {
  if (!items || items.length === 0) {
    throw new CustomError('Purchase Order is not valid', 400);
  }

  // Fetch all products in a single query
  const itemNames = items.map((item) => item.itemName);
  const products = await Product.find({ name: { $in: itemNames } });

  // Create a map of product names to product documents for easy lookup
  const productMap = new Map(
    products.map((product) => [product.name, product])
  );
  const missingItemNames = itemNames.filter(
    (itemName) => !productMap.has(itemName)
  );

  if (missingItemNames.length > 0) {
    throw new CustomError(
      `Stock Items with Names ${missingItemNames.join(', ')} not found`,
      400
    );
  }

  // Use transactions to ensure atomicity
  const session = await Product.startSession();
  session.startTransaction();

  try {
    // Process items and update quantities and batches
    for (const item of items) {
      const itemDocument = productMap.get(item.itemName)!;

      // Update product quantity
      itemDocument.quantity += item.quantity;

      // Update or create batch
      if (item.batch) {
        const existingBatch = itemDocument.batches.find(
          (batch) => batch.batchNo === item.batch
        );

        if (existingBatch) {
          // Update existing batch
          existingBatch.quantity += item.quantity;
        } else {
          // Create new batch
          itemDocument.batches.push({
            batchNo: item.batch,
            expiryDate: item.expiryDate,
            quantity: item.quantity,
          });
        }
      }

      await itemDocument.save({ session });
    }

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
  } catch (error) {
    // Rollback the transaction if any operation fails
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const handlePurchaseLedgerEntries = async (
  ledgerEntries: IVoucher['ledgerEntries']
) => {
  if (!ledgerEntries || ledgerEntries.length === 0) {
    throw new CustomError('Purchase Order is not valid', 400);
  }

  // Use transactions to ensure atomicity
  const session = await Ledger.startSession();
  session.startTransaction();

  try {
    // Process items and update quantities and batches
    for (const entry of ledgerEntries) {
      const ledger = await Ledger.findOne({ _id: entry.ledger });
      if (!ledger) {
        throw new CustomError(
          `Ledger with name ${entry.ledger} not found`,
          400
        );
      }

      if (entry.drOrCr === 'D' || entry.drOrCr === 'C') {
        ledger.openingBalance += entry.amount;
      } else {
        throw new CustomError('Invalid drOrCr value', 400);
      }

      await ledger.save({ session });
    }
    await session.commitTransaction();
  } catch (error) {
    // Rollback the transaction if any operation fails
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const checkUniqueItem = (items: IVoucher['items']) => {
  if (!items || items.length === 0) {
    throw new CustomError('Purchase Order is not valid', 400);
  }
  const itemNames = items.map((item) => item.itemName);
  const uniqueItemNames = Array.from(new Set(itemNames));
  if (itemNames.length !== uniqueItemNames.length) {
    throw new CustomError('Duplicate item names found', 400);
  }
};

export const createVoucher = asyncHandler(async (req, res, next) => {
  const {
    voucherNumber,
    voucherDate,
    voucherType,
    payeeOrPayer,
    amount,
    paymentMethod,
    items,
    ledgerEntries,
    description,
  } = req.body as IVoucher;

  const validatedData = VoucherSchemaValidation.parse(req.body);

  // check if voucher number is exists
  const voucher = await Voucher.findOne({ voucherNumber: voucherNumber });

  if (voucher) {
    throw new CustomError('Voucher Already Exists', 400);
  }

  // create transaction for each voucher
  const session = await Voucher.startSession();
  session.startTransaction();

  if (voucherType === 'Purchase') {
    checkUniqueItem(items);
    try {
      await handlePurchaseVoucher(items);
      await handlePurchaseLedgerEntries(ledgerEntries);
    } catch (error) {
      throw error;
    }
  }

  if (voucherType === 'Sales') {
    checkUniqueItem(items);
    try {
      await handleSalesVoucher(items);
    } catch (error) {
      throw error;
    }
  }

  // Uncomment this if you want to save the voucher to the database
  const newVoucher = await Voucher.create(req.body);
  await session.commitTransaction();
  session.endSession();
  sendSuccess(res, newVoucher, 200);

  // sendSuccess(res, 'success response', 200);
});

export const getVouchers = asyncHandler(async (req, res, next) => {
  const { filters, startIndex, limit, page } = buildQuery(req.query);
  let query = {};

  if ([...filters].length > 0) {
    query = { $or: [...filters] };
  }
  const voucher = await Voucher.find(query)
    .sort({
      updatedAt: -1,
    })
    .skip(startIndex)
    .limit(limit);
  const total = await Voucher.countDocuments(query);
  const paginatedResponse = attachPagination(voucher, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});
