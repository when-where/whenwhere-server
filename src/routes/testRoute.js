import express from 'express';
const router = express.Router();

router.get('/test', (req, res) => {
  res.send(`
    <h1>로그인/로그아웃 테스트 페이지입니다.</h1>
    <h2>${req.user?.nickname}<h2>
    <br/><br/><br/><br/><br/>
    ${
      req.user?.nickname === undefined
        ? '<p>로그아웃 상태입니다.</p>'
        : '<a href="/auth/signout">카카오 로그아웃</a>'
    }
    <a href="/">홈 으로가기</a>
    <form action="/auth/signout" method="post"><button>로그아웃</button></form>
  `);
});

export default router;
