import mongoose, { Schema, Document } from 'mongoose';

interface StockDocument extends Document {
  name?: string;
  quantity: number;
  mrp: number;
  price: number;
  currency: string;
  supplier: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  batch: string;
  expiryDate: Date;
  recept: {
    notes: string;
    receptNo: string;
    dispatchTrough: string;
    destination: string;
    carrier: string;
    vehicleNo: string;
  };
}

const StockSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    rece,
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Stock = mongoose.model<StockDocument>('Stock', StockSchema);
export default Stock;
