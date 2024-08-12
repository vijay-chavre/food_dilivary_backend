import mongoose, { Schema, Document, Model } from 'mongoose';

interface IGroup {
  groupName: string;
  parentGroupID?: Schema.Types.ObjectId | null;
  nature: 'Assets' | 'Liabilities' | 'Income' | 'Expenses';
  isPrimary: boolean;
  description: string;
}

interface IGroupDocument extends IGroup, Document {}

interface IGroupModel extends Model<IGroupDocument> {}

const GroupSchema: Schema<IGroupDocument> = new Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },
    parentGroupID: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
    },
    nature: {
      type: String,
      enum: ['Assets', 'Liabilities', 'Income', 'Expenses'],
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      maxlength: 500,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Group: IGroupModel = mongoose.model<IGroupDocument, IGroupModel>(
  'Group',
  GroupSchema
);

export default Group;
