import express from 'express';
import { isSignedIn } from '../middlewares/index.js';
import { updateProfile } from '../controllers/user.js';

const router = express.Router();

router.put('/profile', isSignedIn, updateProfile);

export default router;
