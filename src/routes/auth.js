import express from 'express';
import { signIn, signUp } from '../controllers/auth.js';
import { isNotLoggedIn } from '../middlewares/index.js';
const router = express.Router();

router.post('/signup', isNotLoggedIn, signUp);
router.post('/signin', isNotLoggedIn, signIn);

export default router;
