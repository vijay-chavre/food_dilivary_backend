import mongoose, { Schema, Document, Model } from 'mongoose';

interface BrandDocument extends Document {
  name: string;
  description: string;
  image: string;
  products: [
    {
      type: Schema.Types.ObjectId;
      ref: 'Product';
    }
  ];
}

const brandSchema = new Schema<BrandDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Brand = mongoose.model<BrandDocument>('Brand', brandSchema);

export default Brand;
