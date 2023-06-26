import express from 'express';
import passport from 'passport';
import { signIn, signUp, signout, verifyUser, getUserStatus } from '../controllers/auth.js';
import { isSignedIn, isNotSignedIn } from '../middlewares/index.js';
const router = express.Router();

router.post('/signup', isNotSignedIn, signUp);
router.post('/signin', isNotSignedIn, signIn);

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/test');
  }
);

router.post('/signout', isSignedIn, signout);

router.get('/confirm/:confirmationCode', verifyUser);
router.get('/status', getUserStatus);

export default router;
