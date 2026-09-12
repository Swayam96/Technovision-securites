const express = require('express');
const router = express.Router();
const { generatePayroll, listPayrollSlips } = require('../../models/payroll');
const { getUserById } = require('../../models/user');

async function authMiddleware(req, res, next) {
    if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await getUserById(req.session.user_id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
}

router.use(authMiddleware);

router.get('/', async (req, res) => {
    try {
        const date = new Date();
        const year = req.query.year || date.getFullYear();
        const month = req.query.month || (date.getMonth() + 1);
        const items = await listPayrollSlips(year, month);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/generate', async (req, res) => {
    try {
        const { year, month } = req.body;
        await generatePayroll(year, month);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to generate payroll' });
    }
});

module.exports = router;
