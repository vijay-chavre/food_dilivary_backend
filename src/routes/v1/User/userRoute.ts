import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  listS3,
  deleteAllUsers,
} from '../../../controllers/v1/User/userController';
import requireAuth from '../../../middlewares/requireAuth';
import isAdmin from '../../../middlewares/isAdmin';
const router = express.Router();

router.get('/users', requireAuth, getUsers);
router.get('/users/:id', requireAuth, getUserById);
router.post('/users', createUser);
router.put('/users/:id', requireAuth, updateUser);
router.delete('/users', requireAuth, isAdmin, deleteAllUsers);
router.get('/lists3', listS3);
export default router;
