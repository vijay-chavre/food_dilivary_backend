import { send } from 'process';
// write mogoose schema for chat model
import mongoose, { Schema, Document, Model } from 'mongoose';

interface MessageDocument extends Document {
  sender: {
    type: Schema.Types.ObjectId;
    ref: 'User';
  };
  content: string;
  chat: {
    type: Schema.Types.ObjectId;
    ref: 'Chat';
  };
}

const MessageSchema = new Schema<MessageDocument>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
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
