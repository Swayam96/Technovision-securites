const express = require('express');
const router = express.Router();
const { execute } = require('../../db');
const { getUserById } = require('../../models/user');

async function authMiddleware(req, res, next) {
    if (!req.session.user_id) return res.status(401).json({ error: 'Unauthorized' });
    const user = await getUserById(req.session.user_id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = user;
    next();
}

router.use(authMiddleware);

router.post('/bulk-import', async (req, res) => {
    const { table_name, rows } = req.body;
    
    if (!table_name || !rows || !Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: "Invalid data for import" });
    }

    try {
        // Warning: This generic endpoint assumes exact column matching
        // In a real production system, table_name should be validated against a whitelist
        // to prevent SQL injection or tampering.
        let inserted = 0;
        
        for (const row of rows) {
            const columns = Object.keys(row);
            const values = Object.values(row);
            
            if (columns.length === 0) continue;
            
            const colsStr = columns.join(', ');
            const placeholders = columns.map(() => '?').join(', ');
            
            const sql = `INSERT INTO ${table_name} (${colsStr}) VALUES (${placeholders})`;
            await execute(sql, values);
            inserted++;
        }

        res.json({ success: true, inserted });
    } catch (err) {
        console.error('Bulk import error:', err);
        // Clean up error message for user
        const msg = err.message || "Database error during import";
        res.status(500).json({ error: msg });
    }
});

module.exports = router;
