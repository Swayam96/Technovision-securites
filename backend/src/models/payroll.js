const { execute, fetchAll } = require('../db');

function monthBounds(year, month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0); // Last day of month
    return { start, end };
}

async function generatePayroll(year, month) {
    const { start, end } = monthBounds(year, month);
    
    // Fetch active employees
    const employees = await fetchAll("SELECT id, base_salary FROM employees WHERE status = 'Active'");
    
    // Get all attendance for the month
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    const attendance = await fetchAll(`
        SELECT employee_id, work_date, check_in FROM attendance_days
        WHERE work_date >= ? AND work_date <= ? AND check_in IS NOT NULL
    `, [startStr, endStr]);
    
    // Get approved leaves
    const leaves = await fetchAll(`
        SELECT employee_id, start_date, end_date FROM leave_requests
        WHERE status = 'Approved' 
        AND start_date <= ? AND end_date >= ?
    `, [endStr, startStr]);
    
    const results = [];
    
    for (const emp of employees) {
        const empId = emp.id;
        const baseSalary = parseFloat(emp.base_salary) || 0;
        
        let presentCount = 0;
        let leaveCount = 0;
        
        // Total work days
        let workDays = 0;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                workDays++;
            }
        }
        
        // Count present days
        const empAtt = attendance.filter(a => a.employee_id === empId);
        for (const att of empAtt) {
            const d = new Date(att.work_date);
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                presentCount++;
            }
        }
        
        // Count leaves
        const empLeaves = leaves.filter(l => l.employee_id === empId);
        for (const l of empLeaves) {
            const lStart = new Date(l.start_date);
            const lEnd = new Date(l.end_date);
            for (let d = new Date(lStart); d <= lEnd; d.setDate(d.getDate() + 1)) {
                if (d >= start && d <= end && d.getDay() !== 0 && d.getDay() !== 6) {
                    leaveCount++;
                }
            }
        }
        
        if (leaveCount > workDays - presentCount) {
            leaveCount = workDays - presentCount;
        }
        
        const absentDays = Math.max(0, workDays - presentCount - leaveCount);
        
        const basicFull = baseSalary * 0.5;
        const hraFull = baseSalary * 0.3;
        const daFull = baseSalary * 0.2;
        
        const paidRatio = workDays === 0 ? 0 : (presentCount + leaveCount) / workDays;
        
        const basic = basicFull * paidRatio;
        const hra = hraFull * paidRatio;
        const da = daFull * paidRatio;
        const gross = basic + hra + da;
        
        const pt = gross > 10000 ? 200 : 0;
        const pf = basic > 0 ? basic * 0.12 : 0;
        const deductions = pt + pf;
        const net = gross - deductions;
        
        // Check if exists
        const existing = await fetchAll('SELECT id FROM payroll_slips WHERE employee_id = ? AND month = ? AND year = ?', [empId, month, year]);
        
        if (!existing.length) {
            await execute(`
                INSERT INTO payroll_slips (
                    employee_id, month, year, total_days, present_days, leave_days, absent_days,
                    base_salary, basic_salary, hra, da, gross_salary, deductions, net_salary
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                empId, month, year, workDays, presentCount, leaveCount, absentDays,
                baseSalary, basic, hra, da, gross, deductions, net
            ]);
        }
        
        results.push({ empId, net });
    }
    
    return results;
}

async function listPayrollSlips(year, month) {
    return await fetchAll(`
        SELECT p.*, e.employee_name, d.department_name, ds.designation_name
        FROM payroll_slips p
        JOIN employees e ON e.id = p.employee_id
        LEFT JOIN departments d ON d.id = e.department_id
        LEFT JOIN designations ds ON ds.id = e.designation_id
        WHERE p.year = ? AND p.month = ?
    `, [year, month]);
}

module.exports = {
    generatePayroll,
    listPayrollSlips
};
