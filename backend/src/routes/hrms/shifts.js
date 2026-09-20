const express = require('express');
const router = express.Router();
const { listShifts, getShift, createShift, updateShift, deleteShift } = require('../../models/shift');
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
        const items = await listShifts();
        res.json(items);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await getShift(req.params.id);
        if (!item) return res.status(404).json({ error: 'Shift not found' });
        res.json(item);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const id = await createShift(req.body);
        res.json({ success: true, id });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message || 'Failed to create shift' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        await updateShift(req.params.id, req.body);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message || 'Failed to update shift' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteShift(req.params.id);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(400).json({ error: e.message || 'Failed to delete shift' });
    }
});

module.exports = router;
