import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { z } from 'zod';

const voucherSchema = z.object({
  type: z.string(),
  voucherNumber: z.number().optional(),
});

export type IVoucherNumber = z.infer<typeof voucherSchema>;

interface IVoucherNumberDocument extends IVoucherNumber, Document {}

interface IVoucherNumberModel extends Model<IVoucherNumberDocument> {}

const VoucherNumberSchema: Schema<IVoucherNumberDocument> = new mongoose.Schema(
  {
    type: { type: String, required: true },
    voucherNumber: { type: Number, unique: true, required: true },
  },
  { timestamps: true }
);

const Voucher: IVoucherNumberModel = mongoose.model<
  IVoucherNumberDocument,
  IVoucherNumberModel
>('VoucherNumber', VoucherNumberSchema);

export default Voucher;
