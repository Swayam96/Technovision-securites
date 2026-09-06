const { execute, fetchOne, fetchAll } = require('../db');

const COMPANY_COLUMNS = [
    "company_name", "company_code", "legal_name", "company_type", "status",
    "parent_company", "website", "pan", "gst_registration_status", "gstin",
    "gst_state", "cin", "tan", "registration_number", "registration_date",
    "address_line1", "address_line2", "city", "state", "country", "pincode",
    "phone", "email", "default_currency", "fiscal_year", "default_branch",
    "default_warehouse", "default_price_list", "mod_presales", "mod_sales",
    "mod_purchase", "mod_projects", "mod_inventory", "mod_logistics",
    "mod_service", "mod_amc", "mod_assets", "primary_contact",
    "primary_contact_phone", "primary_contact_email", "finance_contact",
    "operations_contact"
];

async function listCompanies(query = "") {
    let sql = "SELECT * FROM companies";
    let params = [];
    if (query && query.trim()) {
        const like = `%${query.trim()}%`;
        sql += ` WHERE company_name ILIKE ? OR company_code ILIKE ? OR city ILIKE ? OR gstin ILIKE ? OR status ILIKE ?`;
        params.push(like, like, like, like, like);
    }
    sql += " ORDER BY company_name";
    return await fetchAll(sql, params);
}

async function getCompany(id) {
    return await fetchOne("SELECT * FROM companies WHERE id = ?", [id]);
}

async function createCompany(data, ownerId = null) {
    const cols = [...COMPANY_COLUMNS, "owner_id"];
    const placeholders = cols.map(() => '?').join(', ');
    const values = COMPANY_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(ownerId);
    
    const result = await execute(`INSERT INTO companies (${cols.join(', ')}) VALUES (${placeholders})`, values);
    return result.lastrowid;
}

async function updateCompany(id, data) {
    const assignments = COMPANY_COLUMNS.map(c => `${c} = ?`).join(', ');
    const values = COMPANY_COLUMNS.map(c => data[c] !== undefined ? data[c] : null);
    values.push(id);
    
    await execute(`UPDATE companies SET ${assignments}, updated_at = NOW() WHERE id = ?`, values);
}

async function deleteCompany(id) {
    await execute("DELETE FROM companies WHERE id = ?", [id]);
}

module.exports = {
    COMPANY_COLUMNS,
    listCompanies,
    getCompany,
    createCompany,
    updateCompany,
    deleteCompany
};
