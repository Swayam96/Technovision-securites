const { execute, fetchOne, fetchAll } = require('../db');

const DESIGNATION_COLUMNS = [
    "designation_name", "designation_code", "company_id", "department_id", "status", "description"
];

async function listDesignations(query = "") {
    let sql = `
        SELECT g.*, c.company_name, d.department_name
        FROM designations g
        LEFT JOIN companies c ON c.id = g.company_id
        LEFT JOIN departments d ON d.id = g.department_id
    `;
    let params = [];
    if (query && query.trim()) {
        const like = `%${query.trim()}%`;
        sql += ` WHERE g.designation_name ILIKE ? OR g.designation_code ILIKE ? OR g.status ILIKE ? OR c.company_name ILIKE ? OR d.department_name ILIKE ?`;
        params.push(like, like, like, like, like);
    }
    sql += " ORDER BY g.designation_name";
    return await fetchAll(sql, params);
}

async function getDesignation(id) {
    return await fetchOne(`
        SELECT g.*, c.company_name, d.department_name
        FROM designations g
        LEFT JOIN companies c ON c.id = g.company_id
        LEFT JOIN departments d ON d.id = g.department_id
        WHERE g.id = ?
    `, [id]);
}

async function createDesignation(data, ownerId = null) {
    const cols = [...DESIGNATION_COLUMNS, "owner_id"];
    const placeholders = cols.map(() => '?').join(', ');
    const values = DESIGNATION_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(ownerId);
    
    const result = await execute(`INSERT INTO designations (${cols.join(', ')}) VALUES (${placeholders})`, values);
    return result.lastrowid;
}

async function updateDesignation(id, data) {
    const assignments = DESIGNATION_COLUMNS.map(c => `${c} = ?`).join(', ');
    const values = DESIGNATION_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(id);
    
    await execute(`UPDATE designations SET ${assignments}, updated_at = NOW() WHERE id = ?`, values);
}

async function deleteDesignation(id) {
    await execute("DELETE FROM designations WHERE id = ?", [id]);
}

module.exports = {
    DESIGNATION_COLUMNS,
    listDesignations,
    getDesignation,
    createDesignation,
    updateDesignation,
    deleteDesignation
};
