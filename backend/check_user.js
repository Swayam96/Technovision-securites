const { pool } = require('./src/db');
pool.query("UPDATE users SET role_id = 'user' WHERE username = 'swayam96'")
  .then(res => {
    console.log("Updated rows:", res.rowCount);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
