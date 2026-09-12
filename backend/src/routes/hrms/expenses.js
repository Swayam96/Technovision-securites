const express = require('express');
const router = express.Router();
const { getUserById } = require('../../models/user');
const { fetchOne } = require('../../db');

// Basic auth middleware (similar to attendance)
async function authMiddleware(req, res, next) {
    if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await getUserById(req.session.user_id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    
    // Attach employee info
    const emp = await fetchOne('SELECT id, employee_name FROM employees WHERE user_id = $1', [user.id]);
    if (emp) {
        req.employeeId = emp.id;
        req.employeeName = emp.employee_name;
    }
    
    next();
}

router.use(authMiddleware);

// Mock Data
const expensesList = [
    {
        id: "EXP-2026-0018",
        date: "18-08-2026",
        employee: "Rohit Sharma",
        expense_type: "Travel (Outstation)",
        customer: "ABC Industries",
        project: "P-1042 - Office Setup",
        amount: 2450,
        status: "Approved",
        payment_mode: "Personal Card (will be reimbursed)",
        merchant: "IRCTC / Indian Railways",
        description: "Train travel for site visit to ABC Industries Pune for installation.",
        timeline: [
            { step: "Submitted", by: "Rohit Sharma", time: "18-08-2026 10:15", done: true },
            { step: "Approved by Prasad Singh (Project Manager)", by: "Prasad Singh", time: "19-08-2026 14:20", done: true },
            { step: "Approved by Onkaresh Tiwari (Director)", by: "Onkaresh Tiwari", time: "20-08-2026 09:10", done: true },
            { step: "Reimbursement Processed", by: "System", time: "21-08-2026 11:30", done: false },
        ]
    },
    {
        id: "EXP-2026-0017",
        date: "16-08-2026",
        employee: "Suraj Yadav",
        expense_type: "Local Conveyance",
        customer: "XYZ Infra",
        project: "P-0987 - CCTV Install",
        amount: 640,
        status: "Submitted",
        payment_mode: "UPI (PhonePe)",
        merchant: "Auto Rickshaw",
        description: "Auto, metro and local travel for troubleshooting at client site.",
        timeline: [
            { step: "Submitted", by: "Suraj Yadav", time: "16-08-2026 14:15", done: true },
            { step: "Pending Approval (Project Manager)", by: "-", time: "-", done: false },
        ]
    },
    {
        id: "EXP-2026-0016",
        date: "14-08-2026",
        employee: "Prathmesh Patil",
        expense_type: "Material Purchase",
        customer: "No Customer",
        project: "-",
        amount: 1850,
        status: "Under Review",
        payment_mode: "Cash",
        merchant: "Local Hardware Store",
        description: "Purchased some immediate required material for office repair.",
        timeline: [
            { step: "Submitted", by: "Prathmesh Patil", time: "14-08-2026 10:00", done: true },
            { step: "Under Review (HR/Admin)", by: "-", time: "-", done: false },
        ]
    },
    {
        id: "EXP-2026-0015",
        date: "12-08-2026",
        employee: "Shiv Kumar",
        expense_type: "Fuel",
        customer: "ABC Industries",
        project: "P-1042 - Office Setup",
        amount: 3200,
        status: "Reimbursed",
        payment_mode: "Corporate Card",
        merchant: "Shell Fuel Station",
        description: "Fuel expense for site visit to ABC Industries Pune.",
        timeline: [
            { step: "Submitted", by: "Shiv Kumar", time: "12-08-2026 09:30", done: true },
            { step: "Approved", by: "Admin", time: "12-08-2026 14:00", done: true },
            { step: "Reimbursement Processed", by: "Finance", time: "13-08-2026 10:00", done: true },
        ]
    },
    {
        id: "EXP-2026-0014",
        date: "10-08-2026",
        employee: "Rohit Sharma",
        expense_type: "Hotel / Accommodation",
        customer: "LMN Pharma",
        project: "P-1105 - AMC Visit",
        amount: 4800,
        status: "Approved",
        payment_mode: "Personal Card (will be reimbursed)",
        merchant: "Hotel Lemon Tree",
        description: "Stay for 1 night during AMC visit.",
        timeline: [
            { step: "Submitted", by: "Rohit Sharma", time: "10-08-2026 08:30", done: true },
            { step: "Approved", by: "Admin", time: "11-08-2026 11:00", done: true },
        ]
    },
    {
        id: "EXP-2026-0013",
        date: "08-08-2026",
        employee: "Suraj Yadav",
        expense_type: "Food / Meals",
        customer: "XYZ Infra",
        project: "P-0987 - CCTV Install",
        amount: 320,
        status: "Reimbursed",
        payment_mode: "UPI (Google Pay)",
        merchant: "Local Restaurant",
        description: "Lunch during CCTV installation.",
        timeline: [
            { step: "Submitted", by: "Suraj Yadav", time: "08-08-2026 13:30", done: true },
            { step: "Approved", by: "Admin", time: "08-08-2026 16:00", done: true },
            { step: "Reimbursement Processed", by: "Finance", time: "09-08-2026 12:00", done: true },
        ]
    }
];

const summaryData = {
    my_expenses: { amount: 12450, count: 8 },
    pending_approval: { amount: 8320, count: 4 },
    approved: { amount: 24600, count: 12 },
    reimbursed: { amount: 18950, count: 10 }
};

// GET all expenses
router.get('/', (req, res) => {
    res.json({
        summary: summaryData,
        expenses: expensesList
    });
});

// GET single expense
router.get('/:id', (req, res) => {
    const expense = expensesList.find(e => e.id === req.params.id);
    if (expense) {
        res.json(expense);
    } else {
        res.status(404).json({ error: 'Expense not found' });
    }
});

module.exports = router;
