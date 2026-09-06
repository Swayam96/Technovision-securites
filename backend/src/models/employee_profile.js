const { execute, fetchOne, fetchAll } = require('../db');

const PROFILE_SELECT = `
    SELECT p.id, p.full_name, p.address, p.birth_date, p.joining_date,
           p.user_id, p.phone, p.email, p.status, p.owner_id,
           p.created_at, p.updated_at,
           p.father_name, p.father_occupation, p.mother_name, p.mother_occupation,
           p.current_address, p.permanent_address, p.mobile_number,
           p.secondary_number, p.emergency_number,
           p.doc_aadhaar, p.doc_pan, p.doc_address_proof, p.doc_light_bill,
           COALESCE(NULLIF(p.username, ''), u.username, '') AS username
    FROM employee_profiles p
    LEFT JOIN users u ON u.id = p.user_id
`;

async function listEmployeeProfiles(query = "") {
    let sql = PROFILE_SELECT;
    let params = [];
    if (query && query.trim()) {
        const like = `%${query.trim()}%`;
        sql += `
            WHERE p.full_name ILIKE ? OR p.address ILIKE ? OR p.status ILIKE ?
            OR p.phone ILIKE ? OR p.email ILIKE ? OR u.username ILIKE ?
            OR p.username ILIKE ? OR p.birth_date ILIKE ? OR p.joining_date ILIKE ?
        `;
        params.push(like, like, like, like, like, like, like, like, like);
    }
    sql += " ORDER BY p.full_name";
    return await fetchAll(sql, params);
}

async function listEmployeeProfilesForMaster(currentProfileId = null) {
    let sql = PROFILE_SELECT + `
        WHERE (
            p.status = 'Active'
            AND p.id NOT IN (
                SELECT profile_id FROM employees WHERE profile_id IS NOT NULL
            )
        ) OR p.id = ?
        ORDER BY p.full_name
    `;
    return await fetchAll(sql, [currentProfileId || 0]);
}

async function getEmployeeProfile(id) {
    return await fetchOne(PROFILE_SELECT + " WHERE p.id = ?", [id]);
}

async function createEmployeeProfile(data, ownerId = null) {
    const result = await execute(`
        INSERT INTO employee_profiles (
            full_name, address, birth_date, joining_date,
            user_id, username, phone, email, status, owner_id,
            father_name, father_occupation, mother_name, mother_occupation,
            current_address, permanent_address, mobile_number,
            secondary_number, emergency_number
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        data.full_name,
        data.address || data.current_address || "",
        data.birth_date,
        data.joining_date,
        data.user_id || null,
        data.username || "",
        data.phone || data.mobile_number || "",
        data.email,
        data.status,
        ownerId,
        data.father_name || "",
        data.father_occupation || "",
        data.mother_name || "",
        data.mother_occupation || "",
        data.current_address || "",
        data.permanent_address || "",
        data.mobile_number || "",
        data.secondary_number || "",
        data.emergency_number || ""
    ]);
    return result.lastrowid;
}

async function updateEmployeeProfile(id, data) {
    await execute(`
        UPDATE employee_profiles
        SET full_name = ?, address = ?, birth_date = ?, joining_date = ?,
            user_id = ?, username = ?, phone = ?, email = ?, status = ?,
            father_name = ?, father_occupation = ?, mother_name = ?, mother_occupation = ?,
            current_address = ?, permanent_address = ?, mobile_number = ?,
            secondary_number = ?, emergency_number = ?, updated_at = NOW()
        WHERE id = ?
    `, [
        data.full_name,
        data.address || data.current_address || "",
        data.birth_date,
        data.joining_date,
        data.user_id || null,
        data.username || "",
        data.phone || data.mobile_number || "",
        data.email,
        data.status,
        data.father_name || "",
        data.father_occupation || "",
        data.mother_name || "",
        data.mother_occupation || "",
        data.current_address || "",
        data.permanent_address || "",
        data.mobile_number || "",
        data.secondary_number || "",
        data.emergency_number || "",
        id
    ]);
}

async function deleteEmployeeProfile(id) {
    await execute("DELETE FROM employee_profiles WHERE id = ?", [id]);
}

module.exports = {
    listEmployeeProfiles,
    listEmployeeProfilesForMaster,
    getEmployeeProfile,
    createEmployeeProfile,
    updateEmployeeProfile,
    deleteEmployeeProfile
};
