

import express from 'express';
import { signIn } from '../../../controllers/v1/authController.js';
const router = express.Router();

/**
 * @openAI
 * /signIn:
 *   get:
 *     description: Returns the homepage
 *     responses:
 *       200:
 *         description: hello world
 */
router.post('/signIn', signIn)

export default router