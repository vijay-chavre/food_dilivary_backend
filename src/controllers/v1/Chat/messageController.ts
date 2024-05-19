import { RequestHandler } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.ts';
import sendSuccess, { ApiResponse } from '../../../utils/sucessHandler.ts';
import { CustomError } from '../../../utils/errorhandler.ts';
import Chat from '../../../models/v1/Chat/chatModel.ts';
import Message from '../../../models/v1/Chat/messageModel.ts';
import mongoose from 'mongoose';
import { UserDocument } from '../../../models/v1/User/userModel.ts';
import { emitSocketEvent } from '../../../socket/index.ts';
import { ChatEventEnum } from '../../../constants.ts';

const commonMessageAggregation = [
  {
    $lookup: {
      from: 'users',
      localField: 'sender',
      foreignField: '_id',
      as: 'sender',
    },
  },
  {
    $unwind: '$sender',
  },
  {
    $project: {
      _id: 1,
      'sender._id': 1,
      'sender.name': 1,
      'sender.email': 1,
      chat: 1,
      content: 1,
      createdAt: 1,
    },
  },
];

export const getMessages: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { chatId } = req.params;
    const user = req.user as UserDocument;
    if (!user || !chatId) {
      throw new CustomError('All fields are required', 400);
    }

    const selectedChat = await Chat.findById(chatId);
    if (!selectedChat) {
      throw new CustomError('Chat not found', 404);
    }

    const messages = await Message.aggregate([
      {
        $match: { chat: new mongoose.Types.ObjectId(chatId) },
      },
      ...commonMessageAggregation,
    ]);
    sendSuccess(res, messages, 200);
  }
);

export const sendMessage: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const { chatId, content } = req.body;
    const user = req.user as UserDocument;
    if (!user || !chatId || !content) {
      throw new CustomError('All fields are required', 400);
    }

    const selectedChat = await Chat.findById(chatId);
    if (!selectedChat) {
      throw new CustomError('Chat not found', 404);
    }

    const message = await Message.create({
      sender: new mongoose.Types.ObjectId(user._id),
      content: content || '',
      chat: new mongoose.Types.ObjectId(chatId),
    });

    // update the chat's last message which could be utilized to show last message in the list item
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: message._id,
        },
      },
      { new: true }
    );

    if (!chat) {
      throw new CustomError('Chat not found', 404);
    }

    const messages = await Message.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(message._id),
        },
      },
      ...commonMessageAggregation,
    ]);

    // Store the aggregation result
    const receivedMessage = messages[0];

    chat.participants.forEach((participantObjectId) => {
      // here the chat is the raw instance of the chat in which participants is the array of object ids of users
      // avoid emitting event to the user who is sending the message
      if (participantObjectId.toString() === user._id) return;

      // emit the receive message event to the other participants with received message as the payload
      emitSocketEvent(
        req.app.get('io'),
        participantObjectId.toString(),
        ChatEventEnum.MESSAGE_RECEIVED_EVENT,
        receivedMessage
      );
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, receivedMessage, 'Message saved successfully')
      );
  }
);
