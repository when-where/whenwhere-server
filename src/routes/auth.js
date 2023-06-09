import express from 'express';
import passport from 'passport';
import { signUp } from '../controllers/auth.js';
import { isNotLoggedIn } from '../middlewares/index.js';
const router = express.Router();

router.post('/signup', isNotLoggedIn, signUp);

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

router.get('/logout', (req, res) => {
  req.logout(function () {
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

export default router;
