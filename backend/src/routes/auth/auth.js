const express = require('express');
const router = express.Router();
const { getUserByUsername } = require('../../models/user');
const { verifyPassword } = require('../../auth');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const normalizedUsername = (username || '').trim().toLowerCase();
        const row = await getUserByUsername(normalizedUsername);
        if (!row || !row.is_active || !verifyPassword(password, row.password_hash)) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        req.session.user_id = row.id;
        
        if (row.must_change_password) {
            return res.json({ redirect: '/change-password', user_id: row.id });
        }
        
        return res.json({ redirect: '/', user_id: row.id });
    } catch (e) {
        console.error('Login error:', e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    return res.json({ redirect: '/login' });
});

router.get('/me', async (req, res) => {
    if (req.session.user_id) {
        const { getUserById } = require('../../models/user');
        const user = await getUserById(req.session.user_id);
        if (user && user.is_active) {
            return res.json({ user });
        }
    }
    return res.status(401).json({ error: 'Unauthorized' });
});

router.post('/change-password', async (req, res) => {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const { getUserById, updateUser } = require('../../models/user');
        const user = await getUserById(req.session.user_id);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        await updateUser(user.id, { 
            full_name: user.full_name, 
            role_id: user.role_id, 
            is_active: user.is_active, 
            password: password, 
            must_change_password: false 
        });
        return res.json({ success: true, redirect: '/' });
    } catch (e) {
        console.error('Change password error:', e);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
