const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// --- Dashboard Stats ---
router.get('/dashboard', async (req, res) => {
    try {
        const result = {
            totalStockValue: '48,75,000',
            totalItems: 2486,
            warehouses: 8,
            stockMovements: 324
        };
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper for generating standard CRUD endpoints safely checking columns
const createCrudRoutes = (router, path, tableName) => {
    // GET all
    router.get(path, async (req, res) => {
        try {
            const { rows } = await pool.query(`SELECT * FROM ${tableName} ORDER BY id DESC`);
            res.json(rows);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // POST
    router.post(path, async (req, res) => {
        try {
            const colRes = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [tableName]);
            const allowedCols = colRes.rows.map(r => r.column_name);
            
                        // HACK: Auto-map frontend generic fields to actual DB schema fields
            const possibleIdCol = allowedCols.find(c => c.endsWith('_id') || c.endsWith('_code') || c.endsWith('_no'));
            if (req.body.project_code && !allowedCols.includes('project_code') && possibleIdCol && possibleIdCol !== 'project_id' && possibleIdCol !== 'customer_id') {
                req.body[possibleIdCol] = req.body.project_code;
            }
            const possibleNameCol = allowedCols.find(c => c.endsWith('_name') || c.includes('name'));
            if (req.body.name && !allowedCols.includes('name') && possibleNameCol) {
                req.body[possibleNameCol] = req.body.name;
            }

            delete req.body.id;
            const keys = [];
            const values = [];
            for (const key of Object.keys(req.body)) {
                if (allowedCols.includes(key)) {
                    if (req.body[key] === '') continue; // Skip empty strings
                    keys.push(key);
                    values.push(req.body[key]);
                }
            }
            if (keys.length === 0) return res.status(400).json({ error: 'No valid fields' });
            
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
            
            const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING id`;
            const { rows } = await pool.query(query, values);
            res.json({ id: rows[0].id });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // GET one
    router.get(`${path}/:id`, async (req, res) => {
        try {
            const { rows } = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [req.params.id]);
            if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(rows[0]);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // PUT
    router.put(`${path}/:id`, async (req, res) => {
        try {
            const colRes = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = $1`, [tableName]);
            const allowedCols = colRes.rows.map(r => r.column_name);
            
                        // HACK: Auto-map frontend generic fields to actual DB schema fields
            const possibleIdCol = allowedCols.find(c => c.endsWith('_id') || c.endsWith('_code') || c.endsWith('_no'));
            if (req.body.project_code && !allowedCols.includes('project_code') && possibleIdCol && possibleIdCol !== 'project_id' && possibleIdCol !== 'customer_id') {
                req.body[possibleIdCol] = req.body.project_code;
            }
            const possibleNameCol = allowedCols.find(c => c.endsWith('_name') || c.includes('name'));
            if (req.body.name && !allowedCols.includes('name') && possibleNameCol) {
                req.body[possibleNameCol] = req.body.name;
            }

            delete req.body.id;
            const keys = [];
            const values = [];
            for (const key of Object.keys(req.body)) {
                if (allowedCols.includes(key)) {
                    if (req.body[key] === '') continue; // Skip empty strings
                    keys.push(key);
                    values.push(req.body[key]);
                }
            }
            if (keys.length === 0) return res.status(400).json({ error: 'No valid fields' });
            
            const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
            values.push(req.params.id);
            
            const query = `UPDATE ${tableName} SET ${setClause} WHERE id=$${values.length}`;
            await pool.query(query, values);
            res.json({ success: true });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
};

createCrudRoutes(router, '/warehouses', 'inventory_warehouses');
createCrudRoutes(router, '/ledger', 'inventory_stock_ledger');
createCrudRoutes(router, '/receipts', 'inventory_material_receipt');
createCrudRoutes(router, '/issues', 'inventory_material_issue');
createCrudRoutes(router, '/transfers', 'inventory_stock_transfer');
createCrudRoutes(router, '/reconciliations', 'inventory_stock_reconciliation');
createCrudRoutes(router, '/deliveries', 'inventory_delivery');
createCrudRoutes(router, '/returns', 'inventory_returns');

module.exports = router;
