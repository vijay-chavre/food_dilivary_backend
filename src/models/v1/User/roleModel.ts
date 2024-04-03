import mongoose, { Schema, Model, Document } from 'mongoose';
export type Role = (typeof roles)[number];
export interface RoleDocument extends Document {
  name: String;
  description: string;
}
const roles = ['admin', 'user', 'manager', 'editor'] as const;

const roleSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, 'This Role already exists'],
      default: 'user',
      validate: {
        validator: (v: Role) => {
          // Check if the value is included in the roles array
          if (!roles.includes(v)) {
            throw new Error(
              `${v} is not a valid role. Choose from [${roles.join(', ')}]`
            );
          }
          return true;
        },
      },
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

// This is necessary to avoid the error: "Cannot set property 'id' of undefined"
roleSchema.virtual('id').get(function (this: RoleDocument) {
  return this._id.toHexString();
});

roleSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc: any, ret: any) {
    //delete ret._id;
    delete ret.__v;
  },
});

const User: Model<RoleDocument> = mongoose.model<RoleDocument>(
  'Role',
  roleSchema
);

export default User;
