const express = require('express');
const app = express();

// Key สำหรับดูหน้าเว็บ GUI
const SECRET_KEY = "dyumra123";
// Key สำหรับ executor
const LUA_KEY = "dyumra123";

// Lua script ของคุณ จาก GitHub
const luaScript = `loadstring(game:HttpGet("https://raw.githubusercontent.com/dyumra/kuy/refs/heads/main/.gitignore.lua"))()`;

// หน้าเว็บ GUI inline
const htmlPage = `
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Secure Access</title>
<style>
  body {background:#1a0000;color:#fff;font-family:system-ui,"Segoe UI",Arial;display:grid;place-items:center;height:100vh;}
  .card {background:#330000;border-radius:20px;box-shadow:0 0 60px #ff000033;padding:28px 30px;max-width:420px;width:92%;}
  h1 {margin:0 0 18px;text-align:center;color:#ff4d4d;}
  input,button {width:100%;border:0;border-radius:12px;padding:14px;font-size:16px;}
  input {background:#4d0000;color:#ffc6c6;margin-bottom:12px;}
  button {background:#ff1a1a;color:#1a0000;font-weight:600;cursor:pointer;}
  .hint {opacity:.6;font-size:13px;text-align:center;margin-top:8px;}
  pre {background:#4d0000;padding:12px;border-radius:12px;overflow-x:auto; display:none;}
</style>
</head>
<body>
<div class="card">
  <h1>Secure Access</h1>
  <input id="password" placeholder="Enter password">
  <button id="accessBtn">Access</button>
  <div class="hint">Authorized users only.</div>
  <pre id="script"></pre>
</div>
<script>
const accessBtn = document.getElementById("accessBtn");
const passwordInput = document.getElementById("password");
const scriptBox = document.getElementById("script");

accessBtn.onclick = async () => {
  if(passwordInput.value === "${SECRET_KEY}") {
    try {
      const res = await fetch("/script.lua", { headers: { "Authorization": "${LUA_KEY}" } });
      if(res.ok){
        const luaCode = await res.text();
        scriptBox.style.display = "block";
        scriptBox.textContent = luaCode;
      } else {
        alert("Failed to load script.");
      }
    } catch(e){
      alert("Error: " + e.message);
    }
  } else {
    alert("Wrong password!");
  }
}
</script>
</body>
</html>
`;

// Endpoint สำหรับ executor โหลด Lua script
app.get('/script.lua', (req, res) => {
  const auth = req.headers['authorization'];
  if(auth === LUA_KEY){
    res.type('text/plain').send(luaScript);
  } else {
    res.status(403).send("Access denied! Please use executor with key.");
  }
});

// หน้าเว็บ GUI
app.get('/', (req, res) => {
  res.send(htmlPage);
});

// ใช้ PORT จาก Render หรือ 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
