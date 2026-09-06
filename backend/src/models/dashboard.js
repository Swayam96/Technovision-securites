const { execute, fetchOne, fetchAll } = require('../db');

const OPEN_STATUSES = ["open", "draft", "unpaid", "in progress", "ordered", "active"];

async function countsByModule(moduleIds = null) {
    let sql = "SELECT module_id, COUNT(*) AS c FROM records";
    let params = [];
    if (moduleIds && moduleIds.length > 0) {
        const placeholders = moduleIds.map(() => '?').join(', ');
        sql += ` WHERE module_id IN (${placeholders})`;
        params.push(...moduleIds);
    }
    sql += " GROUP BY module_id";
    
    const rows = await fetchAll(sql, params);
    const counts = {};
    rows.forEach(row => {
        counts[row.module_id] = parseInt(row.c, 10);
    });
    return counts;
}

async function dashboardStats(moduleIds = null) {
    const placeholdersOpen = OPEN_STATUSES.map(() => '?').join(', ');
    let where = "";
    let params = [];
    
    if (moduleIds && moduleIds.length > 0) {
        const modulePh = moduleIds.map(() => '?').join(', ');
        where = ` WHERE module_id IN (${modulePh})`;
        params.push(...moduleIds);
    }
    
    const totalRow = await fetchOne(`SELECT COUNT(*) as c FROM records${where}`, params);
    const total = parseInt(totalRow ? totalRow.c : 0, 10);
    
    let openParams = [...OPEN_STATUSES, ...params];
    let openWhere = ` WHERE lower(status) IN (${placeholdersOpen})`;
    if (moduleIds && moduleIds.length > 0) {
        const modulePh = moduleIds.map(() => '?').join(', ');
        openWhere += ` AND module_id IN (${modulePh})`;
    }
    
    const openCountRow = await fetchOne(`SELECT COUNT(*) as c FROM records${openWhere}`, openParams);
    const openCount = parseInt(openCountRow ? openCountRow.c : 0, 10);
    
    const recent = await fetchAll(`
        SELECT id, module_id, function_id, entity, title, status, created_at, pipeline_id
        FROM records${where} ORDER BY id DESC LIMIT 6
    `, params);
    
    return { total, open: openCount, recent };
}

module.exports = {
    countsByModule,
    dashboardStats,
};
