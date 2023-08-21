

import express from 'express';
import { signIn } from '../../../controllers/v1/authController.js';
const router = express.Router();


router.post('/signIn', signIn)

export default router