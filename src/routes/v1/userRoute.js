
import express from 'express';
import { createUser, getUsers } from '../../controllers/v1/userController.js';
const router = express.Router();


router.get('/users', getUsers)
router.post('/users', createUser)
export default router