const express = require('express');
const router = express.Router();
const { listCompanies, getCompany, createCompany, updateCompany, deleteCompany, COMPANY_COLUMNS } = require('../models/company');
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
        const companies = await listCompanies(query);
        res.json(companies);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const company = await getCompany(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = await createCompany(req.body, req.user.id);
        res.json({ success: true, id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create company' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateCompany(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update company' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteCompany(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete company' });
    }
});

module.exports = router;
