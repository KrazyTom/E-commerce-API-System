import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register',  validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/profile', verifyToken, getProfile);

export default router;
