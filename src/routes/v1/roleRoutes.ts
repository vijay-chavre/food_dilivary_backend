import express from 'express';
import { getRoles, createRole } from '../../controllers/v1/roleController.ts';
const router = express.Router();

router.get('/roles', getRoles);
router.post('/roles', createRole);

export default router;
