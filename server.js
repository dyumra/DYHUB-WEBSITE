import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// config
const API_KEY   = process.env.API_KEY || "c3cb14bc1f39528d7cdf84f441822deb";
const SCRIPT_URL = "https://raw.githubusercontent.com/dyumra/Dupe-Anime-Rails/refs/heads/main/DYHUB-LoaderV1.lua";

// หน้า Secure Access สำหรับคนเปิดเว็บตรง
app.get("/", (_req, res) => {
  res.type("html").send(`
  <!doctype html><html><head><meta charset="utf-8">
  <title>Secure Access</title>
  <style>
    body{background:#0b1220;color:#fff;font-family:system-ui;display:grid;place-items:center;height:100vh}
    .card{background:#0f1526;border-radius:20px;box-shadow:0 0 60px #0ad3ff22;padding:28px 30px;max-width:420px;width:92%}
    h1{margin:0 0 18px;text-align:center}
    input,button{width:100%;border:0;border-radius:12px;padding:14px;font-size:16px}
    input{background:#1b2440;color:#cfe0ff;margin-bottom:12px}
    button{background:#19bfff;color:#00142a;font-weight:600;cursor:not-allowed;opacity:.8}
    .hint{opacity:.6;font-size:13px;text-align:center;margin-top:8px}
  </style></head>
  <body>
  <div class="card"><h1>Secure Access</h1>
    <input placeholder="Enter password" disabled>
    <button disabled>Access</button>
    <div class="hint">Authorized users only.</div>
  </div></body></html>
  `);
});

// Endpoint ลับที่ส่งสคริปต์
app.get(`/${API_KEY}`, async (_req, res) => {
  try {
    const response = await fetch(SCRIPT_URL);
    const code = await response.text();
    res.type("text/plain").send(code);
  } catch (e) {
    res.status(500).send("-- error: " + e.message);
  }
});

app.listen(PORT, () => console.log("DYHUB backend running on " + PORT));
