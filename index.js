const express = require('express');
const app = express();

const SECRET_KEY = 'dyumra123';

// Lua script ของคุณ
const luaScript = `loadstring(game:HttpGet("https://raw.githubusercontent.com/dyumra/kuy/refs/heads/main/.gitignore.lua"))()`;

// หน้าเว็บ GUI สำหรับกรอกรหัส
const htmlPage = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>Secure Script Access</title>
  <style>
    body { background: #1a0000; color: #fff; font-family: Arial, sans-serif; display: grid; place-items: center; height: 100vh; }
    .container { background: #330000; padding: 20px; border-radius: 10px; box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); }
    h1 { text-align: center; color: #ff4d4d; }
    input, button { width: 100%; padding: 10px; margin: 10px 0; border-radius: 5px; border: none; }
    input { background: #4d0000; color: #fff; }
    button { background: #ff1a1a; color: #fff; cursor: pointer; }
    pre { background: #4d0000; padding: 10px; border-radius: 5px; display: none; white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Enter Password</h1>
    <input id="password" type="password" placeholder="Enter password">
    <button id="submit">Submit</button>
    <pre id="script"></pre>
  </div>
  <script>
    document.getElementById('submit').onclick = async () => {
      const password = document.getElementById('password').value;
      if (password === '${SECRET_KEY}') {
        try {
          const res = await fetch('/script.lua');
          if (res.ok) {
            const luaCode = await res.text();
            document.getElementById('script').style.display = 'block';
            document.getElementById('script').textContent = luaCode;
          } else {
            alert('Failed to load script.');
          }
        } catch(e) {
          alert('Error: ' + e.message);
        }
      } else {
        alert('Incorrect password!');
      }
    };
  </script>
</body>
</html>
`;

// endpoint สำหรับ executor โหลด Lua script
app.get('/script.lua', (req, res) => {
  res.type('text/plain').send(luaScript);
});

// หน้าเว็บ GUI
app.get('/:id', (req, res) => {
  res.send(htmlPage);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
