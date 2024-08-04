import mongoose, { Schema, Document } from 'mongoose';

interface VoucherDocument extends Document {
  type: {
    type: string;
    enum: ['purchase', 'sale'];
    required: true;
  };

  subType: {
    type: string;
    enum: ['cash', 'credit'];
  };
  billNo: string;
  note: string;
  supplier: {
    type: Schema.Types.ObjectId;
    ref: 'Supplier';
  };
}

const VoucherSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['purchase', 'sale'],
      required: true,
    },
    subType: {
      type: String,
      enum: ['cash', 'sale'],
      required: true,
    },
    billNo: {
      type: String,
      required: true,
    },
    note: String,
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 30000,
  }
);

const Voucher = mongoose.model<VoucherDocument>('Voucher', VoucherSchema);

export default Voucher;
