const { execute, fetchOne, fetchAll } = require('../db');
const { hashPassword } = require('../auth');
const { replacePermissions } = require('./user');

const EMPLOYEE_SELECT = `
    SELECT e.*,
           c.company_name,
           b.branch_name,
           d.department_name,
           g.designation_name,
           r.role_name,
           mgr.employee_name AS reporting_authority_name
    FROM employees e
    LEFT JOIN companies c ON c.id = e.company_id
    LEFT JOIN branches b ON b.id = e.branch_id
    LEFT JOIN departments d ON d.id = e.department_id
    LEFT JOIN designations g ON g.id = e.designation_id
    LEFT JOIN org_roles r ON r.id = e.org_role_id
    LEFT JOIN employees mgr ON mgr.id = e.reporting_authority_id
`;

async function listEmployees(query = "") {
    let sql = EMPLOYEE_SELECT;
    let params = [];
    if (query && query.trim()) {
        const like = `%${query.trim()}%`;
        sql += `
            WHERE e.employee_name ILIKE ? OR e.username ILIKE ? OR e.status ILIKE ?
            OR c.company_name ILIKE ? OR b.branch_name ILIKE ?
            OR d.department_name ILIKE ? OR g.designation_name ILIKE ?
            OR r.role_name ILIKE ? OR e.access_role_id ILIKE ?
        `;
        params.push(like, like, like, like, like, like, like, like, like);
    }
    sql += " ORDER BY e.employee_name";
    return await fetchAll(sql, params);
}

async function getEmployee(id) {
    return await fetchOne(EMPLOYEE_SELECT + " WHERE e.id = ?", [id]);
}

async function createEmployee(data, ownerId = null) {
    const profile = await fetchOne("SELECT * FROM employee_profiles WHERE id = ?", [data.profile_id]);
    if (!profile) throw new Error("Select an employee from Employee Profile");
    
    const taken = await fetchOne("SELECT id FROM employees WHERE profile_id = ?", [data.profile_id]);
    if (taken) throw new Error("This employee profile is already in Employee Master");
    
    let reportingAuthId = null;
    if (data.reporting_authority_id) {
        reportingAuthId = parseInt(data.reporting_authority_id);
        const mgr = await fetchOne("SELECT id, profile_id FROM employees WHERE id = ?", [reportingAuthId]);
        if (!mgr) throw new Error("Select a valid reporting authority");
        if (mgr.profile_id && parseInt(mgr.profile_id) === parseInt(data.profile_id)) {
            throw new Error("An employee cannot report to themselves");
        }
    }
    
    const employeeName = profile.full_name;
    const existingUserId = profile.user_id;
    let userId;
    
    const accessRole = "user"; // Changed from "admin" to "user" so RBAC works
    
    if (existingUserId) {
        userId = parseInt(existingUserId);
        const userRow = await fetchOne("SELECT username FROM users WHERE id = ?", [userId]);
        if (userRow) data.username = userRow.username;
        
        const already = await fetchOne("SELECT id FROM employees WHERE user_id = ?", [userId]);
        if (already) throw new Error("This employee already has a login in Employee Master");
        
        await execute(
            "UPDATE users SET full_name = ?, role_id = ?, is_active = ? WHERE id = ?",
            [employeeName, accessRole, data.status === "Active" ? 1 : 0, userId]
        );
    } else {
        const usernameCheck = (data.username || '').trim().toLowerCase();
        const existingUser = await fetchOne("SELECT id FROM users WHERE username = ?", [usernameCheck]);
        if (existingUser) {
            throw new Error("Username already exists. Please choose a different username.");
        }

        const userRes = await execute(
            "INSERT INTO users (username, full_name, role_id, password_hash, must_change_password, is_active) VALUES (?, ?, ?, ?, 1, ?) RETURNING id",
            [usernameCheck, employeeName, accessRole, hashPassword('12345'), data.status === "Active" ? 1 : 0]
        );
        userId = userRes.lastrowid;
    }
    
    if (data.perm_map) {
        await replacePermissions(userId, data.perm_map);
    }
    
    await execute(
        "UPDATE employee_profiles SET user_id = ?, username = ?, updated_at = NOW() WHERE id = ?",
        [userId, data.username, data.profile_id]
    );
    
    const empRes = await execute(
        `INSERT INTO employees (
            employee_name, username, user_id, profile_id, company_id, branch_id,
            department_id, designation_id, org_role_id, reporting_authority_id,
            access_role_id, access_modules, permission_flags, status, owner_id,
            shift_type, base_salary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
        [
            employeeName, data.username, userId, data.profile_id, data.company_id || null, data.branch_id || null,
            data.department_id || null, data.designation_id || null, data.org_role_id || null, reportingAuthId,
            accessRole, (data.access_modules || []).join(','), data.permission_flags || "", data.status, ownerId,
            data.shift_type || "General", data.base_salary || 0
        ]
    );
    return empRes.lastrowid;
}

module.exports = {
    listEmployees,
    getEmployee,
    createEmployee
};
