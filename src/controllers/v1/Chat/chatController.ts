import { RequestHandler } from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.ts';
import sendSuccess from '../../../utils/sucessHandler.ts';
import Chat from '../../../models/v1/Chat/chatModel.ts';
import { UserDocument } from '../../../models/v1/User/userModel.ts';
import { CustomError } from '../../../utils/errorhandler.ts';
import { attachPagination } from '../../../utils/paginatedResponse.ts';
interface Query {
  $or?: {
    name?: { $regex: RegExp; $options?: string };
    type?: { $regex: RegExp; $options?: string };
  }[];
  creator: string;
}

/**
 * Returns all the chats of the user
 * @route GET /chats
 * @group Chats
 * @param {string} page.query.required - The page to return
 * @param {string} limit.query.required - The number of chats to return per page
 * @param {string} search.query - The search string
 * @returns {Array<Object>} 200 - The chats
 * @returns {Error} 400 - Invalid request data
 * @returns {Error} 404 - User not found
 */
export const getChats: RequestHandler = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page as unknown as string, 10) || 1;
  const limit = parseInt(req.query.limit as unknown as string, 10) || 10;
  const search = (req.query.search as unknown as string) || '';

  const startIndex = (page - 1) * limit;
  const user = req.user as UserDocument;
  if (!user?._id) {
    throw new Error('User not found');
  }
  let query: Query = {
    creator: user._id,
  };
  if (search) {
    // line 10
    query.$or = [
      { name: { $regex: new RegExp(search, 'i') } },
      { type: { $regex: new RegExp(search, 'i') } },
    ];
  }
  const chats = await Chat.find(query).skip(startIndex).limit(limit);
  const total = await Chat.countDocuments(query);
  const paginatedResponse = attachPagination(chats, page, limit, total);
  sendSuccess(res, paginatedResponse, 200);
});

/**
 * Creates a new chat
 * @route POST /chats
 * @group Chats
 * @param {Object} req.body.req - The request body
 * @param {string} req.body.req.name - The chat name
 * @param {string} req.body.req.type - The chat type (group/private)
 * @param {string[]} req.body.req.participants - The chat participants
 * @returns {Object} 200 - The created chat
 * @returns {Error} 400 - Invalid request data
 * @returns {Error} 404 - User not found
 * @returns {Error} 422 - Private chat can only have 1 participants
 */
export const createChat: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const data = req.body;
    const user = req.user as UserDocument;

    if (!user?._id) {
      throw new Error('User not found');
    }

    // check for chat name in data
    if (!data.name) {
      throw new CustomError('Chat name is required', 400);
    }
    // check for chat participants in data
    if (data.participants.length === 0) {
      throw new CustomError('Chat participants are required', 400);
    }
    // check if type is group or private and then check number of participants
    if (data.type !== 'group' && data.type !== 'private') {
      throw new CustomError('Chat type is invalid', 400);
    }
    // check if type is private and then check number of participants
    if (data?.type !== 'group' && data.participants.length > 1) {
      // find chat by participant id

      throw new CustomError('Private chat can only have 1 participants', 422);
    }

    // check if chat already exists

    if (data.type === 'private') {
      const chatFound = await Chat.findOne({
        participants: { $in: data.participants[0] },
        type: 'private',
      });
      if (chatFound) {
        return sendSuccess(res, chatFound, 200);
      }
    }

    // create payload
    const payload = {
      name: data.name,
      type: data.type,
      participants: data.participants,
      creator: user._id,
    };

    const chat = new Chat(payload);
    await chat.save();

    sendSuccess(res, chat, 200);
  }
);

// delete All chats
export const deleteAllChats: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const user = req.user as UserDocument;
    if (!user?._id) {
      throw new Error('User not found');
    }
    const chats = await Chat.deleteMany({ creator: user._id });
    sendSuccess(res, chats, 200);
  }
);
