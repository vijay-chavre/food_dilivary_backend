import express from 'express';
import {
  getRoles,
  createRole,
  assignRole,
} from '../../../controllers/v1/User/roleController.ts';
import requireAuth from '../../../middlewares/requireAuth.ts';
const router = express.Router();

router.get('/roles', getRoles);
router.post('/roles', createRole);
router.post('/assignRole', requireAuth, assignRole);

export default router;
