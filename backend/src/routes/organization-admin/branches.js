const express = require('express');
const router = express.Router();
const { listBranches, getBranch, createBranch, updateBranch, deleteBranch } = require('../../models/branch');
const { getUserById } = require('../../models/user');
const { canRead, canWrite, canDo } = require('../../permissions');

// Auth middleware (copied from other routes)
async function authMiddleware(req, res, next) {
    if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await getUserById(req.session.user_id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
}

router.use(authMiddleware);

// Get all branches
router.get('/', async (req, res) => {
    try {
        const can_read = canRead(req.user, 'organization-administration', 'branches');
        if (!can_read) return res.status(403).json({ error: 'Access denied' });
        
        const branches = await listBranches();
        res.json(branches);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create branch
router.post('/', async (req, res) => {
    try {
        const can_create = canDo(req.user, 'organization-administration', 'branches', 'create');
        if (!can_create) return res.status(403).json({ error: 'Access denied' });
        
        const data = req.body;
        if (!data.branch_name) {
            return res.status(400).json({ error: 'Branch name is required' });
        }
        const newBranch = await createBranch(data);
        res.status(201).json(newBranch);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update branch
router.put('/:id', async (req, res) => {
    try {
        const can_write = canWrite(req.user, 'organization-administration', 'branches');
        if (!can_write) return res.status(403).json({ error: 'Access denied' });
        
        const data = req.body;
        if (!data.branch_name) {
            return res.status(400).json({ error: 'Branch name is required' });
        }
        const updatedBranch = await updateBranch(req.params.id, data);
        if (!updatedBranch) return res.status(404).json({ error: 'Branch not found' });
        res.json(updatedBranch);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete branch
router.delete('/:id', async (req, res) => {
    try {
        const can_delete = canDo(req.user, 'organization-administration', 'branches', 'delete');
        if (!can_delete) return res.status(403).json({ error: 'Access denied' });
        
        await deleteBranch(req.params.id);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
