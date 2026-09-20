const { execute, fetchOne, fetchAll } = require('../db');
const { hashPassword } = require('../auth');

const ACTION_IDS = ["read", "write", "create", "submit", "cancel", "amend", "print", "email", "export", "report", "share", "delete", "import"];


async function getUserByUsername(username) {
    const user = await fetchOne('SELECT * FROM users WHERE username = ?', [username]);
    if (user) {
        user.perms = await getUserPermissions(user.id);
        const emp = await fetchOne('SELECT r.role_name FROM employees e LEFT JOIN org_roles r ON r.id = e.org_role_id WHERE e.user_id = ?', [user.id]);
        if (emp) user.org_role_name = emp.role_name;
    }
    return user;
}

async function getUserById(id) {
    const user = await fetchOne('SELECT * FROM users WHERE id = ?', [id]);
    if (user) {
        user.perms = await getUserPermissions(user.id);
        const emp = await fetchOne('SELECT r.role_name FROM employees e LEFT JOIN org_roles r ON r.id = e.org_role_id WHERE e.user_id = ?', [user.id]);
        if (emp) user.org_role_name = emp.role_name;
    }
    return user;
}

async function listUsers() {
    return await fetchAll('SELECT * FROM users ORDER BY lower(full_name)');
}

async function createUser({ username, full_name, role_id, password, must_change_password = true, is_active = true }) {
    const pwdHash = hashPassword(password);
    const result = await execute(`
        INSERT INTO users (username, full_name, role_id, password_hash, must_change_password, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [username.trim().toLowerCase(), full_name.trim(), role_id, pwdHash, must_change_password ? 1 : 0, is_active ? 1 : 0]);
    return result.lastrowid;
}

async function updateUser(id, { full_name, role_id, is_active, password, must_change_password }) {
    await execute('UPDATE users SET full_name = ?, role_id = ?, is_active = ? WHERE id = ?', 
        [full_name.trim(), role_id, is_active ? 1 : 0, id]);
        
    if (password) {
        await execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashPassword(password), id]);
    }
    if (must_change_password !== undefined) {
        await execute('UPDATE users SET must_change_password = ? WHERE id = ?', [must_change_password ? 1 : 0, id]);
    }
}

async function getUserPermissions(userId) {
    const rows = await fetchAll('SELECT * FROM user_permissions WHERE user_id = ?', [userId]);
    const perms = {};
    rows.forEach(row => {
        perms[`${row.module_id}:${row.function_id}`] = {};
        ACTION_IDS.forEach(action => {
            perms[`${row.module_id}:${row.function_id}`][action] = !!row[`can_${action}`];
        });
    });
    return perms;
}

async function replacePermissions(userId, perms) {
    await execute('DELETE FROM user_permissions WHERE user_id = ?', [userId]);
    
    for (const [key, raw] of Object.entries(perms)) {
        const [moduleId, functionId] = key.split(':');
        const flags = {};
        ACTION_IDS.forEach(action => {
            flags[action] = !!raw[action];
        });
        
        if (!Object.values(flags).some(v => v)) continue;
        
        const cols = ACTION_IDS.map(a => `can_${a}`).join(', ');
        const placeholders = ACTION_IDS.map(() => '?').join(', ');
        const values = [userId, moduleId, functionId, ...ACTION_IDS.map(a => flags[a] ? 1 : 0)];
        
        await execute(`
            INSERT INTO user_permissions (user_id, module_id, function_id, ${cols})
            VALUES (?, ?, ?, ${placeholders})
        `, values);
    }
}

module.exports = {
    getUserByUsername,
    getUserById,
    listUsers,
    createUser,
    updateUser,
    getUserPermissions,
    replacePermissions
};
