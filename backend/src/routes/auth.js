// backend/src/routes/auth.js
import express from 'express';
import { login, register, getMe, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', getMe);
router.get('/logout', logout);

export default router;