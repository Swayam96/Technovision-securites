const express = require('express');
const router = express.Router();
const { listDesignations, getDesignation, createDesignation, updateDesignation, deleteDesignation } = require('../../models/designation');
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
        const query = req.query.q || '';
        const items = await listDesignations(query);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await getDesignation(req.params.id);
        if (!item) return res.status(404).json({ error: 'Designation not found' });
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = await createDesignation(req.body, req.user.id);
        res.json({ success: true, id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create designation' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateDesignation(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update designation' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteDesignation(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete designation' });
    }
});

module.exports = router;
