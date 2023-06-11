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
import redis from 'redis';
import RedisStore from 'connect-redis';

dotenv.config();

let redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
  client: redisClient,
  prefix: 'session:',
});

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
    store: redisStore,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.get('/', (req, res) => {
  res.send(`
  <h1>Hello World!</h1>
    <form id="signin-form" action="/auth/signin" method="post">
      <div class="input-group">
        <label for="email">이메일</label>
        <input id="email" type="email" name="email" required autofocus />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input id="password" type="password" name="password" required />
      </div>
      <button id="signin" type="submit" class="btn">로그인</button>
    </form>
    <a href="/auth/kakao">카카오로 로그인</a>
    <a href="/test">테스트 페이지</a>
    <form id="signup-form" action="/auth/signup" method="post">
    <div class="input-group">
      <label for="signup-email">이메일</label>
      <input id="signup-email" type="email" name="email" />
    </div>
    <div class="input-group">
      <label for="signup-nickname">닉네임</label>
      <input id="signup-nickname" type="text" name="nickname" />
    </div>
    <div class="input-group">
      <label for="signup-password">비밀번호</label>
      <input id="signup-password" type="password" name="password" />
    </div>
    <button id="signup-btn" type="submit" class="btn">회원가입</button>
  </form>
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
