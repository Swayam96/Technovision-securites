const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// A wrapper to match the Python execute syntax where '?' is mapped to '$1', '$2', etc.
async function execute(sql, params = []) {
  let paramIndex = 1;
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  const client = await pool.connect();
  try {
    const res = await client.query(pgSql, params);
    return {
      rows: res.rows,
      rowCount: res.rowCount,
      lastrowid: res.rows.length > 0 && res.rows[0].id ? res.rows[0].id : null,
    };
  } finally {
    client.release();
  }
}

async function fetchOne(sql, params = []) {
  const result = await execute(sql, params);
  return result.rows.length > 0 ? result.rows[0] : null;
}

async function fetchAll(sql, params = []) {
  const result = await execute(sql, params);
  return result.rows;
}

module.exports = {
  pool,
  execute,
  fetchOne,
  fetchAll,
};
