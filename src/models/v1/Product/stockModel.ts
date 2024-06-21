import mongoose, { Schema, Document, Model } from 'mongoose';

interface StockDocument extends Document {
  product: {
    type: Schema.Types.ObjectId;
    ref: 'Product';
  };
  quantity: number;
  lotNumber: string;
  expiryDate: Date;
  manufacturingDate: Date;
  price: number;
  gstRate: number;
}

const stockSchema = new Schema<StockDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
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
    price: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturingDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 30000,
  }
);

const Stock: Model<StockDocument> = mongoose.model('Stock', stockSchema);

export default Stock;
