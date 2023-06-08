import User from '../models/User.js';
import bcrypt from 'bcrypt';

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
    });
    return res
      .status(201)
      .json({ success: true, data: { message: '회원가입이 완료되었습니다.' }, error: null });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
