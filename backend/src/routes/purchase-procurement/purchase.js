const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// --- Dashboard Stats ---
router.get('/dashboard', async (req, res) => {
    try {
        const result = {
            purchaseOrders: 18,
            pendingApprovals: 6,
            grns: 14,
            poValue: '2.48 Cr'
        };
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- RFQ ---
router.get('/rfq', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT r.*, s.supplier_name 
            FROM purchase_rfq r 
            LEFT JOIN suppliers s ON r.supplier_id = s.id 
            ORDER BY r.id DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/rfq', async (req, res) => {
    const { rfq_no, date, supplier_id, subject, status } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO purchase_rfq (rfq_no, date, supplier_id, subject, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [rfq_no, date, supplier_id, subject, status]
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/rfq/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_rfq WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/rfq/:id', async (req, res) => {
    const { rfq_no, date, supplier_id, subject, status } = req.body;
    try {
        await pool.query(
            `UPDATE purchase_rfq SET rfq_no=$1, date=$2, supplier_id=$3, subject=$4, status=$5 WHERE id=$6`,
            [rfq_no, date, supplier_id, subject, status, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Purchase Orders ---
router.get('/orders', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.*, s.supplier_name 
            FROM purchase_order p 
            LEFT JOIN suppliers s ON p.supplier_id = s.id 
            ORDER BY p.id DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/orders', async (req, res) => {
    const { po_no, date, supplier_id, grand_total, status } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO purchase_order (po_no, date, supplier_id, grand_total, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [po_no, date, supplier_id, grand_total, status]
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_order WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/orders/:id', async (req, res) => {
    const { po_no, date, supplier_id, grand_total, status } = req.body;
    try {
        await pool.query(
            `UPDATE purchase_order SET po_no=$1, date=$2, supplier_id=$3, grand_total=$4, status=$5 WHERE id=$6`,
            [po_no, date, supplier_id, grand_total, status, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- GRN ---
router.get('/grn', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT g.*, p.po_no, s.supplier_name
            FROM purchase_grn g 
            LEFT JOIN purchase_order p ON g.po_id = p.id
            LEFT JOIN suppliers s ON p.supplier_id = s.id
            ORDER BY g.id DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/grn', async (req, res) => {
    const { grn_no, date, po_id, warehouse, received_by, status } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO purchase_grn (grn_no, date, po_id, warehouse, received_by, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [grn_no, date, po_id, warehouse, received_by, status]
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/grn/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_grn WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/grn/:id', async (req, res) => {
    const { grn_no, date, po_id, warehouse, received_by, status } = req.body;
    try {
        await pool.query(
            `UPDATE purchase_grn SET grn_no=$1, date=$2, po_id=$3, warehouse=$4, received_by=$5, status=$6 WHERE id=$7`,
            [grn_no, date, po_id, warehouse, received_by, status, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Purchase Invoices ---
router.get('/invoices', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT i.*, s.supplier_name 
            FROM purchase_invoice i 
            LEFT JOIN suppliers s ON i.supplier_id = s.id 
            ORDER BY i.id DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/invoices', async (req, res) => {
    const { invoice_no, date, supplier_id, amount, status } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO purchase_invoice (invoice_no, date, supplier_id, amount, status) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            [invoice_no, date, supplier_id, amount, status]
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/invoices/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_invoice WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/invoices/:id', async (req, res) => {
    const { invoice_no, date, supplier_id, amount, status } = req.body;
    try {
        await pool.query(
            `UPDATE purchase_invoice SET invoice_no=$1, date=$2, supplier_id=$3, amount=$4, status=$5 WHERE id=$6`,
            [invoice_no, date, supplier_id, amount, status, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Supplier Payments ---
router.get('/payments', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.*, s.supplier_name 
            FROM purchase_payment p 
            LEFT JOIN suppliers s ON p.supplier_id = s.id 
            ORDER BY p.id DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/payments', async (req, res) => {
    const { payment_no, date, supplier_id, amount, mode, status } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO purchase_payment (payment_no, date, supplier_id, amount, mode, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [payment_no, date, supplier_id, amount, mode, status]
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/payments/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_payment WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/payments/:id', async (req, res) => {
    const { payment_no, date, supplier_id, amount, mode, status } = req.body;
    try {
        await pool.query(
            `UPDATE purchase_payment SET payment_no=$1, date=$2, supplier_id=$3, amount=$4, mode=$5, status=$6 WHERE id=$7`,
            [payment_no, date, supplier_id, amount, mode, status, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Purchase Returns ---
router.get('/returns', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT r.*, s.supplier_name, g.grn_no
            FROM purchase_return r 
            LEFT JOIN suppliers s ON r.supplier_id = s.id 
            LEFT JOIN purchase_grn g ON r.against_grn_id = g.id
            ORDER BY r.id DESC
        `);
        res.json(rows);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/returns', async (req, res) => {
    const { return_no, date, supplier_id, against_grn_id, reason, status } = req.body;
    try {
        const { rows } = await pool.query(
            `INSERT INTO purchase_return (return_no, date, supplier_id, against_grn_id, reason, status) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            [return_no, date, supplier_id, against_grn_id, reason, status]
        );
        res.json({ id: rows[0].id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/returns/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM purchase_return WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/returns/:id', async (req, res) => {
    const { return_no, date, supplier_id, against_grn_id, reason, status } = req.body;
    try {
        await pool.query(
            `UPDATE purchase_return SET return_no=$1, date=$2, supplier_id=$3, against_grn_id=$4, reason=$5, status=$6 WHERE id=$7`,
            [return_no, date, supplier_id, against_grn_id, reason, status, req.params.id]
        );
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
