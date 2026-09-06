const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Allow any origin
        callback(null, true);
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'technovision-erp-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        httpOnly: true,
        sameSite: 'lax',
    }
}));

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const companiesRoutes = require('./routes/companies');
const departmentsRoutes = require('./routes/departments');
const designationsRoutes = require('./routes/designations');
const rolesRoutes = require('./routes/roles');
const usersRoutes = require('./routes/users');
const modulesRoutes = require('./routes/modules');
const branchesRoutes = require('./routes/branches');
const employeeProfilesRoutes = require('./routes/employee_profiles');
const employeesRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');
const leaveRoutes = require('./routes/leave');
const payrollRoutes = require('./routes/payroll');
const expensesRoutes = require('./routes/expenses');

app.use('/api', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/designations', designationsRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/branches', branchesRoutes);
app.use('/api/employee-profiles', employeeProfilesRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/expenses', expensesRoutes);

// Setup routes
app.get('/health', async (req, res) => {
    try {
        const { pool } = require('./db');
        await pool.query('SELECT 1');
        res.json({ status: 'ok', app: 'Technovision Security', database: 'ok' });
    } catch (e) {
        res.json({ status: 'error', app: 'Technovision Security', database: 'error' });
    }
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Catch-all route to serve React's index.html for client-side routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
