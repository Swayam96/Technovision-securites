const express = require('express');
const router = express.Router();
const { getAttendanceDay, listAttendanceMonth, punchCheckIn, punchCheckOut, listTeamAttendance } = require('../../models/attendance');
const { getUserById } = require('../../models/user');
const { fetchOne } = require('../../db');
const dayjs = require('dayjs');

async function authMiddleware(req, res, next) {
    try {
        if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
        const user = await getUserById(req.session.user_id);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        req.user = user;
        
        // Attach employee info
        const emp = await fetchOne(`
            SELECT e.id, e.employee_name, s.start_time, s.end_time 
            FROM employees e 
            LEFT JOIN shifts s ON s.id = e.shift_id 
            WHERE e.user_id = $1`, [user.id]
        );
        if (emp) {
            req.employeeId = emp.id;
            req.employeeName = emp.employee_name;
            req.shiftStart = emp.start_time || '09:00:00';
            req.shiftEnd = emp.end_time || '18:00:00';
        }
        
        next();
    } catch (e) {
        console.error('Auth middleware error:', e);
        res.status(500).json({ error: 'Auth Error: ' + e.message });
    }
}

router.use(authMiddleware);

// Helper function to format time (e.g. "10:30 AM")
function fmtTime(timeStr) {
    if (!timeStr) return "—";
    // Assuming timeStr is a valid time string or Date object
    return dayjs(timeStr).format('hh:mm A');
}

// Helper function to calculate hours
function fmtHours(checkIn, checkOut) {
    if (!checkIn || !checkOut) return "—";
    const start = dayjs(checkIn);
    const end = dayjs(checkOut);
    const diffMin = end.diff(start, 'minute');
    if (diffMin < 0) return "—";
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
}

router.get('/my', async (req, res) => {
    try {
        if (!req.employeeId) return res.status(403).json({ error: 'no-employee' });

        const today = dayjs();
        const year = parseInt(req.query.year) || today.year();
        const month = parseInt(req.query.month) || today.month() + 1; // 1-indexed

        const startDate = dayjs(`${year}-${month}-01`);
        const endDate = startDate.endOf('month');

        const punchesRaw = await listAttendanceMonth(req.employeeId, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
        
        const punches = {};
        punchesRaw.forEach(p => {
            // Because MySQL DATE might come back as Date objects or strings
            const d = dayjs(p.work_date).format('YYYY-MM-DD');
            punches[d] = p;
        });

        const rows = [];
        let cur = startDate;
        
        while (cur.isBefore(endDate) || cur.isSame(endDate, 'day')) {
            const dStr = cur.format('YYYY-MM-DD');
            const punch = punches[dStr] || {};
            const checkIn = punch.check_in;
            const checkOut = punch.check_out;
            const isWeekend = (cur.day() === 0 || cur.day() === 6);
            let status = isWeekend ? "Weekend" : "Absent";
            
            if (checkIn) {
                const punchInTime = dayjs(checkIn);
                
                // Parse shiftStart from "HH:mm:ss"
                const [sH, sM, sS] = (req.shiftStart || '09:00:00').split(':').map(Number);
                const shiftStart = dayjs(checkIn).hour(sH).minute(sM).second(sS || 0);
                
                const isLate = punchInTime.isAfter(shiftStart.add(15, 'minute'));
                
                if (checkOut) {
                    const start = dayjs(checkIn);
                    const end = dayjs(checkOut);
                    const diffMin = end.diff(start, 'minute');
                    
                    if (diffMin >= 8 * 60) {
                        status = isLate ? "Late" : "Present";
                    } else {
                        status = "Absent"; // As per requirement: if less than 8 hrs, Absent
                    }
                } else {
                    status = isLate ? "Late (Checked in)" : "Checked in";
                }
            }

            rows.push({
                date: dStr,
                label: cur.format('DD MMM YYYY'),
                weekday: cur.format('ddd'),
                check_in: fmtTime(checkIn),
                check_out: fmtTime(checkOut),
                hours: fmtHours(checkIn, checkOut),
                status: status,
                is_today: cur.format('YYYY-MM-DD') === today.format('YYYY-MM-DD'),
                weekend: isWeekend
            });
            cur = cur.add(1, 'day');
        }

        const todayRow = await getAttendanceDay(req.employeeId, today.format('YYYY-MM-DD'));
        const checkedIn = !!(todayRow && todayRow.check_in);
        const checkedOut = !!(todayRow && todayRow.check_out);

        res.json({
            employee_name: req.employeeName,
            year: year,
            month: month,
            month_label: startDate.format('MMMM YYYY'),
            rows: rows,
            checked_in: checkedIn,
            checked_out: checkedOut,
            today_in: fmtTime(todayRow?.check_in),
            today_out: fmtTime(todayRow?.check_out),
            now_label: today.format('hh:mm A')
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/team', async (req, res) => {
    try {
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const rawItems = await listTeamAttendance(date);
        
        const items = rawItems.map(r => {
            let status = "Not in";
            if (r.check_in) {
                const punchInTime = dayjs(r.check_in);
                const [sH, sM, sS] = (r.start_time || '09:00:00').split(':').map(Number);
                const shiftStart = dayjs(r.check_in).hour(sH).minute(sM).second(sS || 0);
                const isLate = punchInTime.isAfter(shiftStart.add(15, 'minute'));
                
                if (r.check_out) {
                    const start = dayjs(r.check_in);
                    const end = dayjs(r.check_out);
                    const diffMin = end.diff(start, 'minute');
                    
                    if (diffMin >= 8 * 60) {
                        status = isLate ? "Late" : "Present";
                    } else {
                        status = "Absent";
                    }
                } else {
                    status = isLate ? "Late (Checked in)" : "Checked in";
                }
            }
            
            return {
                id: r.id,
                employee_name: r.employee_name,
                username: r.username,
                check_in: fmtTime(r.check_in),
                check_out: fmtTime(r.check_out),
                hours: fmtHours(r.check_in, r.check_out),
                status: status
            };
        });

        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/punch-in', async (req, res) => {
    try {
        if (!req.employeeId) return res.status(403).json({ error: 'You are not linked to an employee record' });
        const now = dayjs();
        const date = now.format('YYYY-MM-DD');
        const time = now.toDate(); 
        await punchCheckIn(req.employeeId, req.user.id, date, time);
        res.json({ success: true, message: 'Checked in successfully.' });
    } catch (e) {
        res.status(400).json({ error: e.message || 'Failed to punch in' });
    }
});

router.post('/punch-out', async (req, res) => {
    try {
        if (!req.employeeId) return res.status(403).json({ error: 'You are not linked to an employee record' });
        const now = dayjs();
        const date = now.format('YYYY-MM-DD');
        const time = now.toDate();
        await punchCheckOut(req.employeeId, date, time);
        res.json({ success: true, message: 'Checked out successfully.' });
    } catch (e) {
        res.status(400).json({ error: e.message || 'Failed to punch out' });
    }
});

router.get('/stats', async (req, res) => {
    try {
        // Simplified stats: For given month (or last 30 days), calc average check in, out, and late days
        const { employeeId } = req.query; 
        // If employeeId is passed, Admin/HR wants to see specific employee stats. 
        // Otherwise use req.employeeId for "My stats".
        const targetEmployee = employeeId ? parseInt(employeeId) : req.employeeId;
        
        if (!targetEmployee) return res.json([]);
        
        const end = dayjs();
        const start = dayjs().subtract(30, 'day');
        
        const punchesRaw = await listAttendanceMonth(targetEmployee, start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
        
        const stats = [];
        let cur = start;
        while (cur.isBefore(end) || cur.isSame(end, 'day')) {
            const dateStr = cur.format('YYYY-MM-DD');
            const row = punchesRaw.find(p => dayjs(p.work_date).format('YYYY-MM-DD') === dateStr);
            
            // To plot check-in and check-out time in a graph, we convert them to hour numbers (e.g., 9.5 for 9:30 AM)
            let checkInVal = null;
            let checkOutVal = null;
            let late = 0;
            
            if (row && row.check_in) {
                const cin = dayjs(row.check_in);
                checkInVal = cin.hour() + (cin.minute() / 60);
                
                // We don't have shiftStart for historical in stats right now without joining, 
                // but let's assume if it's > target shift start + 15 mins, it's late.
                const [sH, sM] = (req.shiftStart || '09:00').split(':').map(Number);
                const shiftStart = cin.hour(sH).minute(sM).second(0);
                if (cin.isAfter(shiftStart.add(15, 'minute'))) late = 1;
                
                if (row.check_out) {
                    const cout = dayjs(row.check_out);
                    checkOutVal = cout.hour() + (cout.minute() / 60);
                }
            }
            
            stats.push({
                name: cur.format('MMM DD'),
                checkIn: checkInVal ? parseFloat(checkInVal.toFixed(2)) : null,
                checkOut: checkOutVal ? parseFloat(checkOutVal.toFixed(2)) : null,
                late: late
            });
            
            cur = cur.add(1, 'day');
        }
        
        res.json(stats);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
