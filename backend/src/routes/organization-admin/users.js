const express = require('express');
const router = express.Router();
const { listUsers, getUserById, createUser, updateUser, getUserPermissions, replacePermissions } = require('../../models/user');

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
        const users = await listUsers();
        // Don't send password hashes to frontend
        const safeUsers = users.map(u => {
            const { password_hash, ...safe } = u;
            return safe;
        });
        res.json(safeUsers);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await getUserById(req.params.id);
        if (!item) return res.status(404).json({ error: 'User not found' });
        const { password_hash, ...safe } = item;
        res.json(safe);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = await createUser(req.body);
        res.json({ success: true, id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateUser(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

router.get('/:id/permissions', async (req, res) => {
    try {
        const perms = await getUserPermissions(req.params.id);
        res.json(perms);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch permissions' });
    }
});

router.put('/:id/permissions', async (req, res) => {
    try {
        await replacePermissions(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to save permissions' });
    }
});

module.exports = router;
