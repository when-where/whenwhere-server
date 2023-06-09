import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import bcrypt from 'bcrypt';

export default () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, {
                code: 'LOGIN_FAILURE',
                message: '이메일 또는 비밀번호가 일치하지 않습니다.',
              });
            }
          } else {
            done(null, false, {
              code: 'LOGIN_FAILURE',
              message: '이메일 또는 비밀번호가 일치하지 않습니다.',
            });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
