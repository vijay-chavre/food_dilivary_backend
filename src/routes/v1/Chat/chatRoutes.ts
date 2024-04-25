import express from 'express';
import requireAuth from '../../../middlewares/requireAuth.ts';
import {
  createChat,
  deleteAllChats,
  getChats,
} from '../../../controllers/v1/Chat/chatController.ts';
import isAdmin from '../../../middlewares/isAdmin.ts';

const router = express.Router();
router.get('/chats', requireAuth, getChats);
router.post('/chats', requireAuth, createChat);
router.delete('/chats', requireAuth, isAdmin, deleteAllChats);

export default router;
