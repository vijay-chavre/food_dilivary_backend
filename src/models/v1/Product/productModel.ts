import mongoose, { Schema, Document, Model } from 'mongoose';

interface IBatch {
  batchNo: string;
  quantity: number;
  expiryDate: Date;
}

const batchSchema = new mongoose.Schema<IBatch>({
  batchNo: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
});
interface IProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  hsn: number;
  gst: number;
  unit: 'kg' | 'gm' | 'litre' | 'ml' | 'piece';
  category: Schema.Types.ObjectId;
  brand: Schema.Types.ObjectId;
  quantity: number;

  batches: IBatch[];
}
interface ProductDocument extends IProduct, Document {}

interface IProductModel extends Model<ProductDocument> {}
const productSchema: Schema<ProductDocument> = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (name: string) => {
          return name.length > 3;
        },
        message: 'Product name must be at least 3 characters long',
      },
    },
    description: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ['kg', 'gm', 'litre', 'ml', 'piece'],
      required: true,
    },
    hsn: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    batches: [batchSchema],
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Product = mongoose.model<ProductDocument, IProductModel>(
  'Product',
  productSchema
);

export default Product;
