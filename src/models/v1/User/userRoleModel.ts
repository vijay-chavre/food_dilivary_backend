import mongoose, { Schema, Model, Document } from 'mongoose';
import { userInfo } from 'os';

export interface UserRoleDocument extends Document {
  userId: string;
  roleId: string;
}

const UserRoleSchema = new Schema<UserRoleDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

// Ensure virtual fields are serialized.
UserRoleSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc: any, ret: any) {
    //delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});
const UserRole: Model<UserRoleDocument> = mongoose.model<UserRoleDocument>(
  'User',
  UserRoleSchema
);

export default UserRole;
