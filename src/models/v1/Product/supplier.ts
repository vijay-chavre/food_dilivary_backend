import mongoose, { Schema, Document } from 'mongoose';

interface SupplierDocument extends Document {
  name: string;
  mobile: string;
  village: string;
  address: {
    state: string;
    city: string;
    pincode: number;
    addressLine1: string;
  };
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifscCode: string;
    accountType: 'current' | 'saving';
  };
  gst: {
    gstNo: string;
    gstType: 'regular' | 'composition' | 'unregistered' | 'unknown';
  };
}

const SupplierSchema = new Schema(
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
      required: true,
    },
    bankDetails: {
      bankName: {
        type: String,
        required: true,
      },
      accountNo: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      bankDetails: {
        bankName: String,
        accountNo: String,
        ifscCode: String,
        accountType: {
          type: String,
          enum: ['current', 'saving'],
          required: true,
        },
      },
    },
    gst: {
      gstNo: {
        type: String,
        required: true,
      },
      gstType: {
        type: String,
        enum: ['regular', 'composition', 'unregistered', 'unknown'],
        required: true,
        default: 'regular',
      },
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Supplier = mongoose.model<SupplierDocument>('Supplier', SupplierSchema);

export default Supplier;
