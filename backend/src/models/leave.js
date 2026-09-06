const { execute, fetchOne, fetchAll } = require('../db');

async function createLeaveRequest(data) {
    const result = await execute(`
        INSERT INTO leave_requests (
            employee_id, user_id, approver_employee_id,
            leave_type, start_date, end_date, reason, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    `, [
        data.employee_id, data.user_id, data.approver_employee_id || null,
        data.leave_type, data.start_date, data.end_date, data.reason
    ]);
    return result.lastrowid;
}

async function listMyLeaveRequests(employeeId) {
    return await fetchAll(`
        SELECT l.*, e.employee_name
        FROM leave_requests l
        JOIN employees e ON e.id = l.employee_id
        WHERE l.employee_id = ?
        ORDER BY l.created_at DESC
    `, [employeeId]);
}

async function listLeaveForApprover(approverId) {
    return await fetchAll(`
        SELECT l.*, e.employee_name, e.username
        FROM leave_requests l
        JOIN employees e ON e.id = l.employee_id
        WHERE l.approver_employee_id = ? AND l.status = 'Pending'
        ORDER BY l.created_at
    `, [approverId]);
}

async function getLeaveRequest(id) {
    return await fetchOne(`
        SELECT l.*, e.employee_name, e.user_id AS employee_user_id
        FROM leave_requests l
        JOIN employees e ON e.id = l.employee_id
        WHERE l.id = ?
    `, [id]);
}

async function setLeaveStatus(id, status) {
    await execute('UPDATE leave_requests SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
}

module.exports = {
    createLeaveRequest,
    listMyLeaveRequests,
    listLeaveForApprover,
    getLeaveRequest,
    setLeaveStatus
};
