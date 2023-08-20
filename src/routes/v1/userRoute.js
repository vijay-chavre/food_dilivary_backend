
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World!');
})
router.get('/users', (req, res) => {
  res.send('all users');
})
export default router