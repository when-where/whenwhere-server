import passport from 'passport';
import local from './localStrategy';
import User from '../models/User';

export default () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } })
      .then((user) => done(null, user))
      .catch((error) => done(error));
  });

  local();
};
