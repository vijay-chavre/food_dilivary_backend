import express from 'express';
import requireAuth from '../../../middlewares/requireAuth.ts';
import {
  createChat,
  getChats,
} from '../../../controllers/v1/Chat/chatController.ts';

const router = express.Router();
router.get('/chats', requireAuth, getChats);
router.post('/chats', requireAuth, createChat);

export default router;
