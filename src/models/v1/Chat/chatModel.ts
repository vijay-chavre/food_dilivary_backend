import { send } from 'process';
// write mogoose schema for chat model
import mongoose, { Schema, Document, Model } from 'mongoose';

interface ChatDocument extends Document {
  name: string;
  creator: {
    type: Schema.Types.ObjectId;
    ref: 'User';
  };
  lastMessage: {
    type: Schema.Types.ObjectId;
    ref: 'Message';
  };
  type: {
    type: string;
    enum: ['group', 'private'];
    default: 'private';
  };
  messages: [
    {
      type: Schema.Types.ObjectId;
      ref: 'Message';
    }
  ];
  participants: [
    {
      type: Schema.Types.ObjectId;
      ref: 'User';
    }
  ];
}

const ChatSchema = new Schema<ChatDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    type: {
      type: String,
      enum: ['group', 'private'],
      default: 'private',
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    bufferTimeoutMS: 300000,
  }
);

const Chat: Model<ChatDocument> = mongoose.model<ChatDocument>(
  'Chat',
  ChatSchema
);

export default Chat;
