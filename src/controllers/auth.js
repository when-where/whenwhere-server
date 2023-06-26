import User from '../models/User.js';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { stmpTransport } from '../config/email.js';

const SALT_ROUNDS = 12;
const JWT_EXPIRE = '1d';

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

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRE });
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    await User.create({
      email,
      nickname,
      password: hash,
      is_valid: false,
      confirmation_code: token,
    });

    res
      .status(201)
      .send({ success: true, data: { message: '회원가입이 완료되었습니다.' }, error: null });

    sendConfirmationEmail(email, res, token);
    return;
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

export const sendConfirmationEmail = (email, res, confirmationCode) => {
  stmpTransport.sendMail(
    {
      from: 'whenwhere',
      to: email,
      subject: '[언제어디] 회원가입 인증 메일',
      html: `<p>아래 링크를 클릭하고 회원가입 절차를 마무리해주세요.</p>
    <a href=http://localhost:8001/auth/confirm/${confirmationCode}>여기를 클릭해주세요.</a>`,
    },
    (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          data: null,
          error: { code: 'SEND_MAIL_FAILURE', message: '메일 전송에 실패했습니다.' },
        });
      } else {
        res.status(200).json({
          success: true,
          data: { message: '메일 전송에 성공했습니다.' },
          error: null,
        });
      }
      stmpTransport.close();
      return;
    }
  );
};

export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        confirmation_code: req.params.confirmationCode,
      },
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        data: null,
        error: { code: 'VERIFY_FAILURE', message: '사용자를 찾지 못했습니다.' },
      });
    }

    jwt.verify(req.params.confirmationCode, process.env.JWT_SECRET, (error) => {
      if (error) {
        return res.status(404).send({
          success: false,
          data: null,
          error: { code: 'VERIFY_FAILURE', message: '토큰이 만료되었습니다.' },
        });
      } else {
        user.is_valid = true;
        user.save((err) => {
          if (err) {
            return res.status(500).send({
              success: false,
              data: null,
              error: { code: 'SERVER_FAILURE', message: '서버 에러가 발생했습니다.' },
            });
          }
          return null;
        });
        return res.send('이메일 인증이 완료되었습니다.');
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.query.email } });

    if (!user) {
      return res.status(404).send({
        success: false,
        data: null,
        error: { code: 'VERIFY_FAILURE', message: '사용자를 찾지 못했습니다.' },
      });
    }

    if (!user.is_valid) {
      return res.status(403).send({
        success: false,
        data: null,
        error: { code: 'VERIFY_NOT_COMPLETED', message: '인증이 완료되지 않았습니다.' },
      });
    }

    return res.status(200).send({
      success: true,
      data: {
        status: true,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
