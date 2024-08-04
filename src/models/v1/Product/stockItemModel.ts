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

  quantity: number;
  lotNumber: string;
  expiryDate: Date;
  manufacturingDate: Date;
  rate: number;
  minRate: number;
  maxRate: number;
  gst: {
    gstRate: number;
    cgstRate: number;
    sgstRate: number;
    gstAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    preGstAmount: number;
    postGstAmount: number;
  };
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
    gst: {
      gstRate: Number,
      cgstRate: Number,
      sgstRate: Number,
      gstAmount: Number,
      cgstAmount: Number,
      sgstAmount: Number,
      preGstAmount: {
        type: Number,
        default: 0,
      },
      postGstAmount: {
        type: Number,
        default: 0,
      },
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
