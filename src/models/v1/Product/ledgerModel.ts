import mongoose, { Schema, Document, Model } from 'mongoose';

interface ILedger {
  ledgerName: string;
  groupID: Schema.Types.ObjectId;
  alias: string;
  inventoryAffected: boolean;
  billByBill: boolean;
  taxDetails: string;
  narration: string;
}

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
