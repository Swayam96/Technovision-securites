const express = require('express');
const router = express.Router();
const { getAttendanceDay, listAttendanceMonth, punchCheckIn, punchCheckOut, listTeamAttendance } = require('../models/attendance');
const { getUserById } = require('../models/user');
const { fetchOne } = require('../db');
const dayjs = require('dayjs');

async function authMiddleware(req, res, next) {
    try {
        if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
        const user = await getUserById(req.session.user_id);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        req.user = user;
        
        // Attach employee info
        const emp = await fetchOne('SELECT id, employee_name FROM employees WHERE user_id = ?', [user.id]);
        if (emp) {
            req.employeeId = emp.id;
            req.employeeName = emp.employee_name;
            req.employeeShiftType = 'General'; // Default to General since column doesn't exist
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
                const shiftType = req.employeeShiftType || 'General';
                let shiftStartHour = shiftType === 'Field' ? 10 : 9;
                
                const shiftStart = dayjs(checkIn).hour(shiftStartHour).minute(0).second(0);
                const isLate = punchInTime.isAfter(shiftStart.add(15, 'minute'));
                
                if (checkOut) {
                    status = isLate ? "Late" : "Present";
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
                const shiftType = r.shift_type || 'General';
                let shiftStartHour = shiftType === 'Field' ? 10 : 9;
                
                const shiftStart = dayjs(r.check_in).hour(shiftStartHour).minute(0).second(0);
                const isLate = dayjs(r.check_in).isAfter(shiftStart.add(15, 'minute'));
                
                if (r.check_out) {
                    status = isLate ? "Late" : "Present";
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

module.exports = router;
