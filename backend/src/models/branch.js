const { execute, fetchOne, fetchAll } = require('../db');

async function listBranches() {
    const sql = `
        SELECT b.*, c.company_name 
        FROM branches b
        LEFT JOIN companies c ON c.id = b.company_id
        ORDER BY b.branch_name
    `;
    return fetchAll(sql);
}

async function getBranch(id) {
    return fetchOne('SELECT * FROM branches WHERE id = ?', [id]);
}

async function createBranch(data) {
    const sql = `
        INSERT INTO branches (branch_name, company_id, status)
        VALUES (?, ?, ?)
        RETURNING *
    `;
    const params = [
        data.branch_name,
        data.company_id || null,
        data.status || 'Active'
    ];
    return fetchOne(sql, params);
}

async function updateBranch(id, data) {
    const sql = `
        UPDATE branches
        SET branch_name = ?, company_id = ?, status = ?, updated_at = NOW()
        WHERE id = ?
        RETURNING *
    `;
    const params = [
        data.branch_name,
        data.company_id || null,
        data.status || 'Active',
        id
    ];
    return fetchOne(sql, params);
}

async function deleteBranch(id) {
    return execute('DELETE FROM branches WHERE id = ?', [id]);
}

module.exports = {
    listBranches,
    getBranch,
    createBranch,
    updateBranch,
    deleteBranch
};
