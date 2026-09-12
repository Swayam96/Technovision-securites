const express = require('express');
const router = express.Router();
const { getUserByUsername } = require('../../models/user');
const { verifyPassword } = require('../../auth');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const row = await getUserByUsername(username);
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

module.exports = router;
