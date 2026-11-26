// TikTok OAuth 回调页（Vercel Serverless Function）
// 回调地址：https://<你的项目名>.vercel.app/api/callback
// 只显示 URL 里的 code / state / error，不存储、不转发、不记录任何参数。

module.exports = (req, res) => {
  const q = req.query || {};
  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  const code = esc(q.code);
  const state = esc(q.state);
  const error = esc(q.error || q.error_description);

  let body;
  if (error) {
    body = `<h2 style="color:#c0392b">授权失败</h2><p>错误信息：</p><pre>${error}</pre>`;
  } else if (code) {
    body = `
      <h2 style="color:#16a34a">授权成功</h2>
      <p>请<b>立即</b>复制浏览器地址栏里的完整网址（或下面的 code）发给 AI 助手，code 很快就会过期，且只能使用一次。</p>
      <p><b>code：</b></p>
      <pre id="code">${code}</pre>
      ${state ? `<p><b>state：</b></p><pre>${state}</pre>` : ''}
      <button onclick="navigator.clipboard.writeText(location.href).then(()=>this.innerText='已复制完整网址')">复制完整网址</button>`;
  } else {
    body = `<h2>回调页已就绪</h2><p>当前网址里没有 code 参数。完成 TikTok 授权后会自动跳转到这里。</p>`;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.status(200).end(`<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>TikTok 授权回调</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:720px;margin:48px auto;padding:0 20px;color:#222;line-height:1.6}
pre{background:#f4f4f5;padding:12px;border-radius:8px;white-space:pre-wrap;word-break:break-all}
button{padding:10px 18px;border:0;border-radius:8px;background:#111;color:#fff;cursor:pointer;font-size:15px}
</style></head><body>${body}</body></html>`);
};
