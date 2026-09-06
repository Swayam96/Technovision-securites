const { execute, fetchOne, fetchAll } = require('../db');

const ROLE_COLUMNS = [
    "role_name", "role_code", "company_id", "department_id", "status", "description"
];

async function listRoles(query = "") {
    let sql = `
        SELECT g.*, c.company_name, d.department_name
        FROM org_roles g
        LEFT JOIN companies c ON c.id = g.company_id
        LEFT JOIN departments d ON d.id = g.department_id
    `;
    let params = [];
    if (query && query.trim()) {
        const like = `%${query.trim()}%`;
        sql += ` WHERE g.role_name ILIKE ? OR g.role_code ILIKE ? OR g.status ILIKE ? OR c.company_name ILIKE ? OR d.department_name ILIKE ?`;
        params.push(like, like, like, like, like);
    }
    sql += " ORDER BY g.role_name";
    return await fetchAll(sql, params);
}

async function getRole(id) {
    return await fetchOne(`
        SELECT g.*, c.company_name, d.department_name
        FROM org_roles g
        LEFT JOIN companies c ON c.id = g.company_id
        LEFT JOIN departments d ON d.id = g.department_id
        WHERE g.id = ?
    `, [id]);
}

async function createRole(data, ownerId = null) {
    const cols = [...ROLE_COLUMNS, "owner_id"];
    const placeholders = cols.map(() => '?').join(', ');
    const values = ROLE_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(ownerId);
    
    const result = await execute(`INSERT INTO org_roles (${cols.join(', ')}) VALUES (${placeholders})`, values);
    return result.lastrowid;
}

async function updateRole(id, data) {
    const assignments = ROLE_COLUMNS.map(c => `${c} = ?`).join(', ');
    const values = ROLE_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(id);
    
    await execute(`UPDATE org_roles SET ${assignments}, updated_at = NOW() WHERE id = ?`, values);
}

async function deleteRole(id) {
    await execute("DELETE FROM org_roles WHERE id = ?", [id]);
}

module.exports = {
    ROLE_COLUMNS,
    listRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole
};
