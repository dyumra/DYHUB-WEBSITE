import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// ตั้งค่าใน Render → Environment Variables
const SCRIPT_ID   = process.env.SCRIPT_ID   || "00e1da56e4fce98c85ed909f3c721e8c"; // พาธลับ
const PASS        = process.env.PASS        || "DYHUB";                      // รหัสเจ้าของ
const SCRIPT_FILE = process.env.SCRIPT_FILE || path.join(process.cwd(), "script.lua");

// UA ที่อนุญาต (เติม/แก้ได้)
const allowedUA = [
  "Roblox", "UniversalRobloxApp", "RobloxStudio",
  "Delta", "KRNL", "Synapse", "Script-Ware", "Fluxus", "Trigon"
];

const isAllowedUA = (ua = "") => {
  const s = ua.toLowerCase();
  return allowedUA.some(x => s.includes(x.toLowerCase()));
};

// หน้า Secure Access
app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html><html><head><meta charset="utf-8">
  <title>Secure Access</title>
  <style>body{background:#0b1220;color:#fff;font-family:system-ui;display:grid;place-items:center;height:100vh}
  .card{background:#0f1526;border-radius:20px;box-shadow:0 0 60px #0ad3ff22;padding:28px 30px;max-width:420px;width:92%}
  h1{margin:0 0 18px;text-align:center}input,button{width:100%;border:0;border-radius:12px;padding:14px;font-size:16px}
  input{background:#1b2440;color:#cfe0ff;margin-bottom:12px}button{background:#19bfff;color:#00142a;font-weight:600;cursor:not-allowed;opacity:.8}
  .hint{opacity:.6;font-size:13px;text-align:center;margin-top:8px}</style></head>
  <body><div class="card"><h1>Secure Access</h1>
  <input placeholder="Enter password" disabled><button disabled>Access</button>
  <div class="hint">Authorized users only.</div></div></body></html>`);
});

// เส้นทางส่งสคริปต์จริง
app.get(`/${SCRIPT_ID}`, (req, res) => {
  const ua   = req.headers["user-agent"] || "";
  const pass = (req.query.pass || "").toString();

  // ถ้าเป็น UA ที่อนุญาต หรือใส่รหัสเจ้าของถูก → ส่งโค้ด
  if (isAllowedUA(ua) || pass === PASS) {
    try {
      const code = fs.readFileSync(SCRIPT_FILE, "utf8");
      res.type("text/plain").send(code);
    } catch (e) {
      res.status(500).type("text/plain").send("-- server error: " + e.message);
    }
  } else {
    // ไม่ผ่าน → กลับไปหน้า Secure
    res.status(403).type("html").send(`<script>location.href="/"</script>`);
  }
});

app.listen(PORT, () => console.log("up on " + PORT));
