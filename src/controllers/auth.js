import User from '../models/User.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

const SALT_ROUNDS = 12;

export const signUp = async (req, res, next) => {
  const { nickname, email, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.status(409).json({
        success: false,
        data: null,
        error: { code: 'DUPLICATED_EMAIL', message: '이미 존재하는 이메일입니다.' },
      });
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      email,
      nickname,
      password: hash,
      is_valid: false,
    });
    return res
      .status(201)
      .json({ success: true, data: { message: '회원가입이 완료되었습니다.' }, error: null });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const signIn = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(401).json({ success: false, data: null, error: info });
    }
    if (!user.is_valid) {
      return res.status(401).json({
        success: false,
        data: null,
        error: {
          code: 'LOGIN_FAILURE',
          message: '인증되지 않은 이메일입니다. 이메일 인증을 해주세요.',
        },
      });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res
        .status(200)
        .json({ success: true, data: { email: user.email, nickname: user.nickname }, error: null });
    });
  })(req, res, next);
};

export const logout = (req, res, next) => {
  req.logout(function (error) {
    if (error) {
      return next(error);
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.send('ok');
  });
};
