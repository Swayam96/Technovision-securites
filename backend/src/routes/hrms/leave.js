const express = require('express');
const router = express.Router();
const { listMyLeaveRequests, listLeaveForApprover, getLeaveRequest, createLeaveRequest, setLeaveStatus } = require('../../models/leave');
const { getUserById } = require('../../models/user');
const { fetchOne } = require('../../db');

async function authMiddleware(req, res, next) {
    if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await getUserById(req.session.user_id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    
    const emp = await fetchOne('SELECT id FROM employees WHERE user_id = ?', [user.id]);
    if (emp) req.employeeId = emp.id;
    
    next();
}

router.use(authMiddleware);

router.get('/my', async (req, res) => {
    try {
        if (!req.employeeId) return res.json([]);
        const items = await listMyLeaveRequests(req.employeeId);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/approvals', async (req, res) => {
    try {
        if (!req.employeeId) return res.json([]);
        const items = await listLeaveForApprover(req.employeeId);
        res.json(items);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.employeeId) return res.status(403).json({ error: 'You are not an employee' });
        
        // Find reporting authority
        const emp = await fetchOne('SELECT reporting_authority_id FROM employees WHERE id = ?', [req.employeeId]);
        
        const id = await createLeaveRequest({
            ...req.body,
            employee_id: req.employeeId,
            user_id: req.user.id,
            approver_employee_id: emp?.reporting_authority_id || null
        });
        res.json({ success: true, id });
    } catch (e) {
        res.status(400).json({ error: e.message || 'Failed to create leave request' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const item = await getLeaveRequest(req.params.id);
        if (!item) return res.status(404).json({ error: 'Leave request not found' });
        
        if (item.approver_employee_id !== req.employeeId && item.employee_user_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to change status' });
        }
        
        await setLeaveStatus(req.params.id, req.body.status);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

module.exports = router;
