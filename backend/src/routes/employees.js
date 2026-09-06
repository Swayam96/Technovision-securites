const express = require('express');
const router = express.Router();
const { listEmployees, getEmployee, createEmployee } = require('../models/employee');
const { getUserById } = require('../models/user');

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
        const query = req.query.q || '';
        const items = await listEmployees(query);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await getEmployee(req.params.id);
        if (!item) return res.status(404).json({ error: 'Employee not found' });
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = await createEmployee(req.body, req.user.id);
        res.json({ success: true, id });
    } catch (e) {
        res.status(400).json({ error: e.message || 'Failed to create employee' });
    }
});

module.exports = router;
