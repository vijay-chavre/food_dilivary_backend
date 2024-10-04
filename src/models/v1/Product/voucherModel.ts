import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { z } from 'zod';
import { PAYMENT_METHODS } from '../../../constants';

export const voucherTypes = [
  'Contra',
  'Payment',
  'Receipt',
  'Journal',
  'Debit Note',
  'Credit Note',
  'Purchase',
  'Sales',
  'Memo',
  'Order',
  'Delivery Note',
  'Receipt Note',
  'Rejection Note',
  'Payroll',
  'Manufacture',
  'Consumption',
  'Purchase Order',
  'Sales Order',
  'Stock Journal',
  'Debit Note',
  'Credit Note',
  'Reversing Journal',
];
const objectIdSchema = z.custom<Types.ObjectId | string>(
  (val) => Types.ObjectId.isValid(val),
  { message: 'Invalid ObjectId' }
);
const LedgerEntrySchema = z.object({
  ledger: objectIdSchema,
  amount: z.number(),
  drOrCr: z.enum(['D', 'C']),
});

const ItemSchema = z.object({
  itemName: z.string(),
  itemId: objectIdSchema.optional(),
  gst: z.number(),
  quantity: z.number(),
  rate: z.number(),
  amount: z.number(),
  batch: z.string().optional(),
  expiryDate: z.string().transform((str) => new Date(str)),
});

export const VoucherSchemaValidation = z.object({
  voucherNumber: z.string().or(z.number()),
  invoiceNumber: z.string(),
  voucherDate: z.string().transform((str) => new Date(str)),
  voucherType: z.enum(voucherTypes as [string, ...string[]]),
  payeeOrPayer: objectIdSchema,
  totalGST: z.number(),
  cgst: z.number(),
  sgst: z.number(),
  amount: z.number(),
  paymentMethod: z
    .enum(['Cash', 'Bank Transfer', 'Cheque', 'Credit'])
    .optional(),
  items: z.array(ItemSchema).optional(),
  ledgerEntries: z.array(LedgerEntrySchema),
  description: z.string().optional(),
});

export type IVoucher = z.infer<typeof VoucherSchemaValidation>;

interface IVoucherDocument extends IVoucher, Document {}

interface IVoucherModel extends Model<IVoucherDocument> {}

const VoucherSchema: Schema<IVoucherDocument> = new mongoose.Schema({
  voucherNumber: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  voucherDate: { type: Date, required: true },
  voucherType: {
    type: String,
    enum: voucherTypes,
    required: true,
  },

  payeeOrPayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger' }, // Reference to Ledger (Payee/Payer)
  amount: { type: Number },
  paymentMethod: { type: String, enum: PAYMENT_METHODS },
  totalGST: { type: Number, required: true, default: 0 },
  cgst: { type: Number, required: true, default: 0 },
  sgst: { type: Number, required: true, default: 0 },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
      gst: { type: Number, required: true, default: 0 },
      batch: {
        type: String,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
    },
  ],
  ledgerEntries: [
    {
      ledger: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger' },
      amount: Number,
      drOrCr: { type: String, enum: ['D', 'C'] }, // Debit or Credit
    },
  ],
  description: { type: String },
});

const Voucher: IVoucherModel = mongoose.model<IVoucherDocument, IVoucherModel>(
  'Voucher',
  VoucherSchema
);

export default Voucher;
