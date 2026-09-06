const { execute, fetchOne, fetchAll } = require('../db');

const DEPARTMENT_COLUMNS = [
    "department_name", "department_code", "company_id", "status", "description"
];

async function listDepartments(query = "") {
    let sql = `
        SELECT d.*, c.company_name 
        FROM departments d
        LEFT JOIN companies c ON c.id = d.company_id
    `;
    let params = [];
    if (query && query.trim()) {
        const like = `%${query.trim()}%`;
        sql += ` WHERE d.department_name ILIKE ? OR d.department_code ILIKE ? OR d.status ILIKE ? OR c.company_name ILIKE ?`;
        params.push(like, like, like, like);
    }
    sql += " ORDER BY d.department_name";
    return await fetchAll(sql, params);
}

async function getDepartment(id) {
    return await fetchOne(`
        SELECT d.*, c.company_name 
        FROM departments d
        LEFT JOIN companies c ON c.id = d.company_id
        WHERE d.id = ?
    `, [id]);
}

async function createDepartment(data, ownerId = null) {
    const cols = [...DEPARTMENT_COLUMNS, "owner_id"];
    const placeholders = cols.map(() => '?').join(', ');
    const values = DEPARTMENT_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(ownerId);
    
    const result = await execute(`INSERT INTO departments (${cols.join(', ')}) VALUES (${placeholders})`, values);
    return result.lastrowid;
}

async function updateDepartment(id, data) {
    const assignments = DEPARTMENT_COLUMNS.map(c => `${c} = ?`).join(', ');
    const values = DEPARTMENT_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(id);
    
    await execute(`UPDATE departments SET ${assignments}, updated_at = NOW() WHERE id = ?`, values);
}

async function deleteDepartment(id) {
    await execute("DELETE FROM departments WHERE id = ?", [id]);
}

module.exports = {
    DEPARTMENT_COLUMNS,
    listDepartments,
    getDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
};
