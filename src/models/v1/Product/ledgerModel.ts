import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.custom<Types.ObjectId | string>(
  (val) => Types.ObjectId.isValid(val),
  { message: 'Invalid ObjectId' }
);

export const ledgerSchema = z.object({
  ledgerName: z.string().min(1, 'Ledger name is required'),
  groupID: objectIdSchema,
  alias: z.string().optional(),
  inventoryAffected: z.boolean(),
  billByBill: z.boolean(),
  taxDetails: z.string().optional(),
  narration: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional(),
  website: z.string().url('Invalid URL').optional(),
  openingBalance: z.number(),
  maintainBalances: z.boolean().optional(),
  creditPeriod: z.number().int().positive().optional(),
  checkForCreditDays: z.boolean().optional(),
  inventoryValuesAffected: z.boolean(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  pinCode: z
    .string()
    .regex(/^\d{6}$/, 'Invalid PIN code')
    .optional(),
  panItNo: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number')
    .optional(),
  gstNo: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number'
    )
    .optional(),
  bankName: z.string().optional(),
  bankAccountNo: z.string().optional(),
  ifscCode: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
    .optional(),
  exciseDetails: z.boolean().optional(),
  vatDetails: z.boolean().optional(),
});

// interface ILedger {
//   ledgerName: string;
//   groupID: Schema.Types.ObjectId;
//   alias: string;
//   inventoryAffected: boolean;
//   billByBill: boolean;
//   taxDetails: string;
//   narration: string;
//   contactPerson?: string;
//   phone?: string;
//   email?: string;
//   website?: string;
//   openingBalance?: number;
//   maintainBalances?: boolean;
//   creditPeriod?: number;
//   checkForCreditDays?: boolean;
//   inventoryValuesAffected?: boolean;
//   address?: string;
//   country?: string;
//   state?: string;
//   pinCode?: string;
//   panItNo?: string;
//   gstNo?: string;
//   bankName?: string;
//   bankAccountNo?: string;
//   ifscCode?: string;
//   exciseDetails?: boolean;
//   vatDetails?: boolean;
// }

type ILedger = z.infer<typeof ledgerSchema>;

interface ILedgerDocument extends ILedger, Document {}

interface ILedgerModel extends Model<ILedgerDocument> {}

const LedgerSchema: Schema<ILedgerDocument> = new Schema(
  {
    ledgerName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    groupID: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    alias: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    inventoryAffected: {
      type: Boolean,
      default: false,
    },
    billByBill: {
      type: Boolean,
      default: false,
    },
    taxDetails: {
      type: String,
      trim: true,
      maxlength: 50,
      default: '',
    },
    narration: {
      type: String,
      maxlength: 500,
      default: '',
    },
    contactPerson: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    openingBalance: {
      type: Number,
    },
    maintainBalances: {
      type: Boolean,
    },
    creditPeriod: {
      type: Number,
    },
    checkForCreditDays: {
      type: Boolean,
    },
    inventoryValuesAffected: {
      type: Boolean,
    },
    address: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    panItNo: {
      type: String,
      trim: true,
    },
    gstNo: {
      type: String,
      trim: true,
    },
    bankName: {
      type: String,
      trim: true,
    },
    bankAccountNo: {
      type: String,
      trim: true,
    },
    ifscCode: {
      type: String,
      trim: true,
    },
    exciseDetails: {
      type: Boolean,
    },
    vatDetails: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Ledger: ILedgerModel = mongoose.model<ILedgerDocument, ILedgerModel>(
  'Ledger',
  LedgerSchema
);

export default Ledger;
