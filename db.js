// db.js
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    user: process.env.PG_USER || 'xiongwei',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'comments',
    password: process.env.PG_PASSWORD || '',
    port: Number(process.env.PG_PORT) || 5432,
    max: 10, // 连接池最大连接数
    idleTimeoutMillis: 30000,
});

// 封装通用的 query 方法 (ES 模块导出)
export const query = (text, params) => pool.query(text, params);
export default pool;