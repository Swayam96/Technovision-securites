const { execute } = require('./db');
const { hashPassword } = require('./auth');

async function seedAdmin() {
    try {
        const username = 'admin';
        const rawPassword = 'admin123';
        const hashedPassword = hashPassword(rawPassword);

        // Ensure "admin" role exists first
        await execute(
            "INSERT INTO org_roles (id, role_code, role_name, status) VALUES (1, 'ADMIN', 'System Administrator', 'Active') ON CONFLICT (id) DO NOTHING"
        );

        // Insert user
        await execute(
            `INSERT INTO users (username, password_hash, full_name, role_id, is_active, must_change_password) 
             VALUES ($1, $2, $3, $4, 1, 0)
             ON CONFLICT (username) DO UPDATE 
             SET password_hash = EXCLUDED.password_hash`,
            [username, hashedPassword, 'System Admin', 1]
        );

        console.log('Successfully seeded admin user:');
        console.log('Username:', username);
        console.log('Password:', rawPassword);
        process.exit(0);
    } catch (e) {
        console.error('Failed to seed admin:', e);
        process.exit(1);
    }
}

seedAdmin();
