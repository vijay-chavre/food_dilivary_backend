import mongoose, { Schema, Document, Model } from 'mongoose';

interface ProductDocument extends Document {
  name: {
    type: string;
    required: boolean;
    validate: {
      validator: (name: string) => boolean;
      message: string;
    };
  };
  description: string;
  price: number;
  image: string;
  hsn: number;
  gst: number;
  unit: {
    type: string;
    enum: ['kg', 'gm', 'litre', 'ml', 'piece'];
    required: boolean;
  };
  category: {
    type: Schema.Types.ObjectId;
    ref: 'Category';
  };
  brand: {
    type: Schema.Types.ObjectId;
    ref: 'Brand';
  };
}

const productSchema = new Schema<ProductDocument>(
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
      required: true,
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
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Product = mongoose.model<ProductDocument>('Product', productSchema);

export default Product;
