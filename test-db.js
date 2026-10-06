// test-db.js

import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
    user: 'xiongwei',          // 你的 postgres 用户名
    host: 'localhost',
    database: 'comments',          // 你的数据库名
    password: '', // 你的密码
    port: 5432,
});

async function testConnection() {
    try {
        // 借用连接池的一个客户端连接
        const client = await pool.connect();

        // 执行一条极简的 SQL 查询当前数据库时间
        const res = await client.query('SELECT NOW() AS current_time');

        console.log('✅ 数据库连接成功！');
        console.log('数据库当前系统时间:', res.rows[0].current_time);

        // 释放客户端连接归还连接池
        client.release();
    } catch (err) {
        console.error('❌ 数据库连接失败:');
        console.error(err.message);
    } finally {
        // 退出脚本
        await pool.end();
    }
}

testConnection();