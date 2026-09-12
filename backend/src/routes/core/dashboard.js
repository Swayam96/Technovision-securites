const express = require('express');
const router = express.Router();
const { dashboardStats, countsByModule } = require('../../models/dashboard');
const { navModules } = require('../../permissions');
const { getUserById } = require('../../models/user');

// Temporary middleware to check if user is logged in
async function authMiddleware(req, res, next) {
    if (!req.session.user_id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await getUserById(req.session.user_id);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = user;
    next();
}

router.get('/', authMiddleware, async (req, res) => {
    try {
        const nav = navModules(req.user);
        const moduleIds = nav.map(m => m.id);
        
        const counts = await countsByModule(moduleIds.length > 0 ? moduleIds : null);
        const stats = await dashboardStats(moduleIds.length > 0 ? moduleIds : null);
        
        res.json({
            navModules: nav,
            counts,
            stats,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
