import express, { type Request, type Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.use(
  cors({
    origin: (origin, cb) => {
      // allow same-origin requests (like curl or server-to-server) and any localhost:*
      if (!origin) return cb(null, true);
      const ok = /^http:\/\/localhost:\d+$/.test(origin);
      cb(null, ok);
    },
    credentials: true,
  })
);
app.use(express.json());

// 简易令牌存储，仅用于示例演示
let accessToken = 'token-initial';
let refreshToken = 'refresh-initial';

// 登录：返回新的 accessToken 和 refreshToken（示例）
app.post('/api/login', (_req: Request, res: Response) => {
  accessToken = 'token-1';
  refreshToken = 'refresh-1';
  res.json({ accessToken, refreshToken });
});

// 刷新令牌：校验传入的 refreshToken，成功则返回新的 accessToken
app.post('/api/refresh', (req: Request, res: Response) => {
  const incoming = req.body?.refreshToken;
  if (!incoming || incoming !== refreshToken) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
  accessToken = `token-${Date.now()}`; // 生成一个新的 token
  res.json({ accessToken });
});

// 受保护接口：需要携带 Authorization: Bearer <accessToken>
app.get('/api/protected', (req: Request, res: Response) => {
  const auth = req.headers['authorization'];
  const expected = `Bearer ${accessToken}`;
  if (!auth || auth !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ ok: true, user: { id: 1, name: 'Alice' }, time: new Date().toISOString() });
});

// 语言演示：返回 Accept-Language
app.get('/api/lang', (req: Request, res: Response) => {
  res.json({ acceptLanguage: req.headers['accept-language'] });
});

// 设置一个演示 cookie（需要 withCredentials: true）
app.get('/api/cookie-set', (_req: Request, res: Response) => {
  res.cookie('example', 'cookie123', { httpOnly: false });
  res.json({ set: true });
});

// 读取请求携带的 cookie（简单返回原始 header）
app.get('/api/cookie-read', (req: Request, res: Response) => {
  res.json({ cookie: req.headers.cookie || null });
});

app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/api/users', (_req: Request, res: Response) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ]);
});

app.post('/api/echo', (req: Request, res: Response) => {
  res.json({ received: req.body });
});

// 模拟慢接口，延迟 2 秒返回
app.get('/api/slow', async (_req: Request, res: Response) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  res.json({ ok: true, delayedMs: 2000, time: new Date().toISOString() });
});

app.get('/api/error', (_req: Request, res: Response) => {
  res.status(400).json({ success: false, errorMessage: 'Business error' });
});

app.listen(PORT, () => {
  console.log(`Example backend running at http://localhost:${PORT}`);
});
