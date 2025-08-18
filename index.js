const express = require('express');
const path = require('path');
const app = express();

const SECRET_KEY = "dyumra123"; // key สำหรับดูหน้าเว็บ
const LUA_KEY = "dyumra123";    // key สำหรับ executor (สามารถใช้เหมือนกัน)

const luaScript = `-- ตัวอย่าง Lua script
print("Hello from DYHUB protected script!")
-- ใส่โค้ด Lua ของคุณตรงนี้`;

app.use(express.static(path.join(__dirname, 'public')));

// Endpoint สำหรับ executor โหลด Lua script
app.get('/script.lua', (req, res) => {
    const auth = req.headers['authorization'];
    if(auth === LUA_KEY){
        res.type('text/plain').send(luaScript);
    } else {
        res.status(403).send("Access denied! Please use executor with key.");
    }
});

// หน้าเว็บ GUI สำหรับคนเข้าลิงก์
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ใช้ PORT จาก Render หรือ 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
