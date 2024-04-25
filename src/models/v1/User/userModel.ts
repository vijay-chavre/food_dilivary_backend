import mongoose, { Schema, Model, Document } from 'mongoose';
import RoleModel from './roleModel.ts';

export interface UserDocument extends Document {
  name: string;
  id: string;
  email: {
    type: string;
    required: true;
    unique: [true, 'This Email is already taken'];
  };
  password: string;
  roles: string[];
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, 'This Email is already taken'],
    },
    password: {
      type: String,
      required: true,
    },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

userSchema.virtual('id').get(function (this: UserDocument) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc: any, ret: any) {
    //delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  'User',
  userSchema
);

export default User;
