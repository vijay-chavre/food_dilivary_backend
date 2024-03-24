import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  listS3,
} from '../../../controllers/v1/User/userController.ts';
import requireAuth from '../../../middlewares/requireAuth.ts';
const router = express.Router();

router.get('/users', requireAuth, getUsers);
router.get('/users/:id', requireAuth, getUserById);
router.post('/users', createUser);
router.put('/users/:id', requireAuth, updateUser);
router.get('/lists3', listS3);
export default router;
