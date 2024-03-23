import mongoose, { Schema, Model, Document } from 'mongoose';
import RoleModel from './roleModel.ts';

const validateRoleIds = async (value: Schema.Types.ObjectId[]) => {
  try {
    const rolesExist = await RoleModel.find({ _id: { $in: value } });
    return rolesExist.length === value.length;
  } catch (error) {
    return false; // Consider validation failed if an error occurs during database query
  }
};

export interface UserDocument extends Document {
  name: string;
  id: string;
  email: {
    type: string;
    required: true;
    unique: [true, 'This Email is already taken'];
  };
  password: string;
  roles: Schema.Types.ObjectId[]; // Type for the roles field
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
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      validate: [
        {
          validator: async (value: Schema.Types.ObjectId[]) => {
            return value && value.length > 0 && (await validateRoleIds(value));
          },
          message: 'One or more roles provided are invalid.',
        },
      ],
    },
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
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

const User: Model<UserDocument> = mongoose.model<UserDocument>(
  'User',
  userSchema
);

export default User;
