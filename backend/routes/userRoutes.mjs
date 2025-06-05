import express from 'express';
import { register, login } from '../controllers/userController.mjs';
import { authenticateToken } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/register', register); // no auth
router.post('/login', login);       // no auth

// Example: secured route (optional if you have user-specific info later)
// router.get('/profile', authenticateToken, getUserProfile);

export default router;
