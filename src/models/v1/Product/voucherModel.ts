import mongoose, { Schema, Document, Model } from 'mongoose';
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

interface ILedgerEntry {
  ledger: Schema.Types.ObjectId;
  amount: number;
  drOrCr: 'D' | 'C';
}

interface IItem {
  itemName: string;
  itemId: Schema.Types.ObjectId | null;
  quantity: number;
  rate: number;
  amount: number;
  batch?: string;
  expiryDate: Date;
}
export interface IVoucher {
  voucherNumber: string;
  voucherDate: Date;
  voucherType:
    | 'Contra'
    | 'Payment'
    | 'Receipt'
    | 'Journal'
    | 'Debit Note'
    | 'Credit Note'
    | 'Purchase'
    | 'Sales'
    | 'Memo'
    | 'Order'
    | 'Delivery Note'
    | 'Receipt Note'
    | 'Rejection Note'
    | 'Payroll'
    | 'Manufacture'
    | 'Consumption'
    | 'Purchase Order'
    | 'Sales Order'
    | 'Stock Journal'
    | 'Debit Note'
    | 'Credit Note'
    | 'Reversing Journal';
  payeeOrPayer: Schema.Types.ObjectId; // Reference to Ledger (Payee/Payer)
  amount?: number;
  paymentMethod?: 'Cash' | 'Bank Transfer' | 'Cheque';
  items?: IItem[]; // You can define the item interface if needed
  ledgerEntries: ILedgerEntry[];
  description?: string;
}

interface IVoucherDocument extends IVoucher, Document {}

interface IVoucherModel extends Model<IVoucherDocument> {}

const VoucherSchema: Schema<IVoucherDocument> = new mongoose.Schema({
  voucherNumber: { type: String, required: true },
  voucherDate: { type: Date, required: true },
  voucherType: {
    type: String,
    enum: voucherTypes,
    required: true,
  },

  payeeOrPayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Ledger' }, // Reference to Ledger (Payee/Payer)
  amount: { type: Number },
  paymentMethod: { type: String, enum: ['Cash', 'Bank Transfer', 'Cheque'] },
  items: [
    {
      itemName: { type: String, required: true },
      quantity: { type: Number, required: true },
      rate: { type: Number, required: true },
      amount: { type: Number, required: true },
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
