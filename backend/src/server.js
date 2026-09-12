const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        // Allow any origin
        callback(null, true);
    },
    credentials: true,
}));
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('./db');

app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'technovision-erp-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 12, // 12 hours
        httpOnly: true,
        sameSite: 'lax',
    }
}));

const authRoutes = require('./routes/auth/auth');
const dashboardRoutes = require('./routes/core/dashboard');
const modulesRoutes = require('./routes/core/modules');

const companiesRoutes = require('./routes/organization-admin/companies');
const departmentsRoutes = require('./routes/organization-admin/departments');
const designationsRoutes = require('./routes/organization-admin/designations');
const rolesRoutes = require('./routes/organization-admin/roles');
const usersRoutes = require('./routes/organization-admin/users');
const branchesRoutes = require('./routes/organization-admin/branches');
const employeeProfilesRoutes = require('./routes/organization-admin/employee_profiles');
const employeesRoutes = require('./routes/organization-admin/employees');

const attendanceRoutes = require('./routes/hrms/attendance');
const leaveRoutes = require('./routes/hrms/leave');
const payrollRoutes = require('./routes/hrms/payroll');
const expensesRoutes = require('./routes/hrms/expenses');

const productsRoutes = require('./routes/products-master-data/products');
const salesRoutes = require('./routes/sales-presales/sales');
const purchaseRoutes = require('./routes/purchase-procurement/purchase');
const projectsRoutes = require('./routes/projects-installation/projects');
const inventoryRoutes = require('./routes/inventory-logistics/inventory');
const serviceRoutes = require('./routes/service-amc/service');
const assetsRoutes = require('./routes/assets-installed-base/assets');
const misRoutes = require('./routes/mis-management/mis');

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
app.use('/api/products', productsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/mis', misRoutes);

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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
