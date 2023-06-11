import express from 'express';
import passport from 'passport';
import { signIn, signUp, logout } from '../controllers/auth.js';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';
const router = express.Router();

router.post('/signup', isNotLoggedIn, signUp);
router.post('/signin', isNotLoggedIn, signIn);

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

router.post('/logout', isLoggedIn, logout);

export default router;
