import express from 'express';
import {
  createUser,
  getUsers,
  updateUser,
  listS3,
} from '../../controllers/v1/userController.js';
import passport from 'passport';
const router = express.Router();

router.get(
  '/users',
  passport.authenticate('jwt', {
    session: false,
    failureMessage: 'Invalid token',
  }),
  getUsers
);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.get('/lists3', listS3);
export default router;
