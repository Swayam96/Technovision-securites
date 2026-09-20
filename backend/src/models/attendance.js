const { execute, fetchOne, fetchAll } = require('../db');

async function getAttendanceDay(employeeId, workDate) {
    return await fetchOne('SELECT * FROM attendance_days WHERE employee_id = ? AND work_date = ?', [employeeId, workDate]);
}

async function listAttendanceMonth(employeeId, start, end) {
    return await fetchAll(`
        SELECT * FROM attendance_days
        WHERE employee_id = ? AND work_date >= ? AND work_date <= ?
        ORDER BY work_date
    `, [employeeId, start, end]);
}

async function punchCheckIn(employeeId, userId, workDate, when) {
    const existing = await getAttendanceDay(employeeId, workDate);
    if (existing && existing.check_in) {
        throw new Error("You have already checked in today");
    }
    
    if (existing) {
        await execute('UPDATE attendance_days SET check_in = ?, user_id = ? WHERE id = ?', [when, userId, existing.id]);
    } else {
        await execute(
            'INSERT INTO attendance_days (employee_id, user_id, work_date, check_in) VALUES (?, ?, ?, ?)',
            [employeeId, userId, workDate, when]
        );
    }
}

async function punchCheckOut(employeeId, workDate, when) {
    const existing = await getAttendanceDay(employeeId, workDate);
    if (!existing || !existing.check_in) {
        throw new Error("Check in first");
    }
    if (existing.check_out) {
        throw new Error("You have already checked out today");
    }
    await execute('UPDATE attendance_days SET check_out = ? WHERE id = ?', [when, existing.id]);
}

async function listTeamAttendance(workDate) {
    return await fetchAll(`
        SELECT e.id, e.employee_name, e.username,
               a.check_in, a.check_out, s.start_time, s.end_time
        FROM employees e
        LEFT JOIN shifts s ON s.id = e.shift_id
        LEFT JOIN attendance_days a
          ON a.employee_id = e.id AND a.work_date = ?
        ORDER BY e.employee_name
    `, [workDate]);
}

module.exports = {
    getAttendanceDay,
    listAttendanceMonth,
    punchCheckIn,
    punchCheckOut,
    listTeamAttendance
};
