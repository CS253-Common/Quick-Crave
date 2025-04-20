// server/db/index.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host:  'localhost' || process.env.DB_HOST,
  port:  5432 || process.env.DB_PORT,
  user:  'yatharthdangi' || process.env.DB_USER,
  password:  ''|| process.env.DB_PASS ,
  database:  'postgres' || process.env.DB_NAME
});

pool.on('connect', () => {
  console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
