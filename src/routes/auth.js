import express from 'express';
import passport from 'passport';
import {
  signIn,
  signUp,
  signOut,
  verifyUser,
  getUserStatus,
  kakaoSignIn,
} from '../controllers/auth.js';
import { isSignedIn, isNotSignedIn } from '../middlewares/index.js';
const router = express.Router();

router.post('/signup', isNotSignedIn, signUp);
router.post('/signin', isNotSignedIn, signIn);

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/kakao',
  }),
  (req, res) => {
    kakaoSignIn(req, res);
  }
);

router.post('/signout', isSignedIn, signOut);

router.get('/confirm/:confirmationCode', verifyUser);
router.get('/status', getUserStatus);

export default router;
