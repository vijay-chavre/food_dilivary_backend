import mongoose, { Schema, Document, Model } from 'mongoose';

interface CategoryDocument extends Document {
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

const categorySchema = new Schema<CategoryDocument>(
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
      required: false,
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

const Category = mongoose.model<CategoryDocument>('Category', categorySchema);

export default Category;
