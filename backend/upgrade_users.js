const { pool } = require('./src/db');

async function upgradeUsers() {
    const client = await pool.connect();
    try {
        console.log("Upgrading old specific accounts to admin...");
        // Update swayam96 and any other intended admins to 'admin' role
        await client.query("UPDATE users SET role_id = 'admin' WHERE username IN ('admin', 'swayam96', 'key')");
        console.log("Users upgraded successfully.");
    } catch (err) {
        console.error("Error upgrading users:", err);
    } finally {
        client.release();
    }
}

upgradeUsers().then(() => process.exit(0)).catch(() => process.exit(1));
