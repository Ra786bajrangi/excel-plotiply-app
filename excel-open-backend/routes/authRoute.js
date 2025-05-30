import express from 'express';
import {
  register,
  login,
  getMe
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Admin test route
router.get('/admin-test', protect, admin, (req, res) => {
  res.json({ message: 'Admin access granted' });
});

export default router;