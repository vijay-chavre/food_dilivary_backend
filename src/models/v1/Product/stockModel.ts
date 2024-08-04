import mongoose, { Schema, Document, Model } from 'mongoose';

interface StockItemDocument extends Document {
  voucher: {
    type: Schema.Types.ObjectId;
    ref: 'Voucher';
  };
  product: {
    type: Schema.Types.ObjectId;
    ref: 'Product';
  };
  supplier: {
    type: Schema.Types.ObjectId;
    ref: 'Supplier';
  };
  gst: number;
  cgst: number;
  sgst: number;
  quantity: number;
  lotNumber: string;
  expiryDate: Date;
  manufacturingDate: Date;
  rate: number;
  minRate: number;
  maxRate: number;
}

const stockItemSchema = new Schema<StockItemDocument>(
  {
    voucher: {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    cgst: {
      type: Number,
      required: true,
    },
    sgst: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    lotNumber: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturingDate: {
      type: Date,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    minRate: {
      type: Number,
      required: true,
    },
    maxRate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 30000,
  }
);

const StockItem: Model<StockItemDocument> = mongoose.model(
  'StockItem',
  stockItemSchema
);

export default StockItem;
