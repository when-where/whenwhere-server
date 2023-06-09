import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import passport from 'passport';
import authRouter from './routes/auth.js';
import testRouter from './routes/testRoute.js';
import passportConfig from './passport/index.js';

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 8001);

// Connect to MySQL
sequelize
  .sync()
  .then(() => {
    console.info('Connected to MySQL database');
  })
  .catch((error) => {
    console.error('Failed to connect to MySQL database', error);
  });

// Middleware
app.use(morgan('dev')); // 배포할 땐 combined
app.use(express.json()); // json 요청 받을 수 있게
app.use(express.urlencoded({ extended: false })); // 폼 요청 받을 수 있게
// 추후 .env에 있는 쿠키 암호키 변경
app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠키전송처리
app.use(
  session({
    resave: false, // 세션을 always 저장할지 설정
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
    secret: process.env.COOKIE_SECRET, // 암호화를 위해 쓰일 키
    cookie: {
      httpOnly: true, // 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록
      secure: false, // if true, https 환경에서만 session 정보를 주고 받을 수 있음
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello World!</h1>
    <a href="/auth/kakao">카카오로 로그인</a>
    <a href="/test">테스트 페이지</a>
  `);
});

// Routes
app.use('/auth', authRouter);
app.use('/', testRouter);

app.use((req, res, next) => {
  // 404 NOT FOUND
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
  res.status(err.status || 500);
});

app.listen(app.get('port'), () => {
  console.info(`Server running on port ${app.get('port')}`);
});
