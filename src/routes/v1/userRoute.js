
import express from 'express';
import { createUser, getUsers, updateUser } from '../../controllers/v1/userController.js';
const router = express.Router();


router.get('/users', getUsers)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
export default router