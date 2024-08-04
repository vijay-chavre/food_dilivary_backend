import mongoose, { Schema, Document, Model } from 'mongoose';

interface CustomerDocument extends Document {
  name: string;
  mobile: string;
  village: string;
  address?: string;
}

const CustomerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    village: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Customer = mongoose.model<CustomerDocument>('Customer', CustomerSchema);

export default Customer;
