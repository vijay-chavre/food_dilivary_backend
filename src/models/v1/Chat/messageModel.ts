import { send } from 'process';
// write mogoose schema for chat model
import mongoose, { Schema, Document, Model } from 'mongoose';

interface MessageDocument extends Document {
  senderId: string;
  content: string;
  chat: {
    type: Schema.Types.ObjectId;
    ref: 'Chat';
  };
}

const MessageSchema = new Schema<MessageDocument>(
  {
    senderId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Message: Model<MessageDocument> = mongoose.model<MessageDocument>(
  'Message',
  MessageSchema
);

export default Message;
