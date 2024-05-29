import express from 'express';
import requireAuth from '../../../middlewares/requireAuth';
import {
  createChat,
  deleteAllChats,
  getChats,
  getChatDetails,
} from '../../../controllers/v1/Chat/chatController';
import isAdmin from '../../../middlewares/isAdmin';
import {
  sendMessage,
  getMessages,
} from '../../../controllers/v1/Chat/messageController';

const router = express.Router();
router.get('/chats', requireAuth, getChats);
router.get('/chats/:id', requireAuth, getChatDetails);
router.post('/chats', requireAuth, createChat);
router.delete('/chats', requireAuth, isAdmin, deleteAllChats);

// messages routes
router.post('/chats/message', requireAuth, sendMessage);
router.get('/chats/message/:chatId', requireAuth, getMessages);

export default router;
