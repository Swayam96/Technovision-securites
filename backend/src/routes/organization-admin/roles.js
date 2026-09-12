const express = require('express');
const router = express.Router();
const { listRoles, getRole, createRole, updateRole, deleteRole } = require('../../models/role');
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
        const items = await listRoles(query);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await getRole(req.params.id);
        if (!item) return res.status(404).json({ error: 'Role not found' });
        res.json(item);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = await createRole(req.body, req.user.id);
        res.json({ success: true, id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create role' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateRole(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update role' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteRole(req.params.id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete role' });
    }
});

module.exports = router;
