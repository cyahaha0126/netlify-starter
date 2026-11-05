process.env._HANDLER = 'comment.handler';

// 一烨知秋纪事录：从 Neon 的整串连线网址（环境变量 NEON_URL）自动拆出资料库设定，
// 不用再手动复制密码。没有设定 NEON_URL 时，就沿用原本的 PG_HOST、PG_PASSWORD 等设定。
(() => {
  const raw = String(process.env.NEON_URL || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^psql\s+/, '')
    .replace(/^['"]|['"]$/g, '');
  if (!raw) return;
  try {
    const u = new URL(raw);
    process.env.PG_HOST = u.hostname;
    process.env.PG_PORT = u.port || '5432';
    process.env.PG_DB = decodeURIComponent(u.pathname.slice(1)) || 'neondb';
    process.env.PG_USER = decodeURIComponent(u.username);
    process.env.PG_PASSWORD = decodeURIComponent(u.password);
    process.env.PG_SSL = 'true';
  } catch (e) {
    console.error('NEON_URL 格式看不懂，请从 Neon 的 Connect 视窗重新复制整串网址');
  }
})();

const http = require('http');
const Waline = require('@waline/vercel');
const serverless = require('serverless-http');

const app = Waline({
  env: 'netlify',
  async postSave(comment) {
    // do what ever you want after save comment
  },
});

module.exports.handler = serverless(http.createServer(app));
