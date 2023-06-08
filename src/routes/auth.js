import express from 'express';
import { signUp } from '../controllers/auth.js';
import { isNotLoggedIn } from '../middlewares/index.js';
const router = express.Router();

router.post('/signup', isNotLoggedIn, signUp);

export default router;
