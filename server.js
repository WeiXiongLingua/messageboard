import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite'; // Node.js 22+ built-in SQLite

// ESM 模式下获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
app.use(express.json());

const db = new DatabaseSync(path.join(__dirname, 'info.db'));

// 初始化建表（如果表不存在）
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

app.post('/api/comments', (req, res) => {
  // 1. 从 req.body 中解构出前端传来的 user 和 content
  const { user, content } = req.body;

  // 判空校验
  if (!user || !content) {
    return res.status(400).json({ error: '用户名和内容不能为空' });
  }

  // 2. 使用预编译参数化语句（防止 SQL 注入）
  const insertStmt = db.prepare('INSERT INTO comments (user, content) VALUES (?, ?)');
  const result = insertStmt.run(user, content);

  // 3. 返回创建成功的响应（包含新插入数据的自增 id）
  res.status(201).json({
    id: result.lastInsertRowid,
    user,
    content
  });
});

// 将 public 目录作为静态资源根目录
app.get('/api/comments', (req, res) => {
  const queryStmt = db.prepare('SELECT * FROM comments ORDER BY id DESC');
  const comments = queryStmt.all();
  res.json(comments);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


