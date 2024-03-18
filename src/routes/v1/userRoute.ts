import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  listS3,
} from '../../controllers/v1/userController.ts';
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
router.get(
  '/users/:id',
  passport.authenticate('jwt', {
    session: false,
    failureMessage: 'Invalid token',
  }),
  getUserById
);
router.post('/users', createUser);
router.put(
  '/users/:id',
  passport.authenticate('jwt', {
    session: false,
    failureMessage: 'Invalid token',
  }),
  updateUser
);
router.get('/lists3', listS3);
export default router;
