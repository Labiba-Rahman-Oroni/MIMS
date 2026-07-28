console.log("ENV CHECK:");
console.log("HOST:", process.env.DB_HOST);
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASSWORD);
console.log("DB:", process.env.DB_NAME);
require('dotenv').config();
const mysql = require('mysql2');

/*
 * createPool keeps multiple DB connections open and ready.
 * Much faster than opening a new connection per query.
 * All config values come from the .env file.
 */
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || '127.0.0.1',
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'MIMS_V2',
  port:               process.env.DB_PORT     || 3306,
  waitForConnections: true,
  connectionLimit:    10,
});

// Test connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ DB connection failed FULL ERROR:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
  connection.release();
});

module.exports = pool;