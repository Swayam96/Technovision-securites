const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// --- Helper function for CRUD endpoints ---
const createCrudEndpoints = (router, path, tableName, defaultMockData) => {
    // GET all
    router.get(`/${path}`, async (req, res) => {
        try {
            const result = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`);
            let rows = result.rows;
            if (rows.length === 0 && defaultMockData) {
                rows = defaultMockData;
            }
            res.json(rows);
        } catch (err) {
            console.error(`Error fetching ${tableName}:`, err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // GET by id
    router.get(`/${path}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
            const result = await pool.query(`SELECT * FROM ${tableName} WHERE id = $1`, [id]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            console.error(`Error fetching ${tableName} id ${req.params.id}:`, err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // POST
    router.post(`/${path}`, async (req, res) => {
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
            const query = `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
            const result = await pool.query(query, values);
            res.status(201).json(result.rows[0]);
        } catch (err) {
            console.error(`Error creating in ${tableName}:`, err);
            res.status(500).json({ error: 'Server error' });
        }
    });

    // PUT
    router.put(`/${path}/:id`, async (req, res) => {
        try {
            const { id } = req.params;
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
            
            const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
            const query = `UPDATE ${tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
            const result = await pool.query(query, [...values, id]);
            if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
            res.json(result.rows[0]);
        } catch (err) {
            console.error(`Error updating ${tableName} id ${req.params.id}:`, err);
            res.status(500).json({ error: 'Server error' });
        }
    });
};

// --- Mock Data Setup ---

const mockItemGroups = [
    { id: 1, group_name: 'CCTV Cameras', parent_group: 'CCTV Camera Products', no_of_items: 120, status: 'Active' },
    { id: 2, group_name: 'CCTV Recorders', parent_group: 'DVR, NVR, XVR', no_of_items: 45, status: 'Active' },
    { id: 3, group_name: 'Network Switches', parent_group: 'Network & PoE Switches', no_of_items: 210, status: 'Active' },
    { id: 4, group_name: 'Networking', parent_group: 'Cables, Connectors, etc.', no_of_items: 180, status: 'Active' },
    { id: 5, group_name: 'Access Control', parent_group: 'Access Control Devices', no_of_items: 75, status: 'Active' }
];

const mockBrands = [
    { id: 1, brand_name: 'Hikvision', country: 'China', no_of_items: 420, status: 'Active' },
    { id: 2, brand_name: 'Dahua', country: 'China', no_of_items: 210, status: 'Active' },
    { id: 3, brand_name: 'CP Plus', country: 'India', no_of_items: 180, status: 'Active' },
    { id: 4, brand_name: 'TP-Link', country: 'China', no_of_items: 150, status: 'Active' },
    { id: 5, brand_name: 'D-Link', country: 'Taiwan', no_of_items: 130, status: 'Active' }
];

const mockUOMs = [
    { id: 1, uom_name: 'Nos', uom_type: 'Numbers', status: 'Active' },
    { id: 2, uom_name: 'Box', uom_type: 'Box', status: 'Active' },
    { id: 3, uom_name: 'Pair', uom_type: 'Pair', status: 'Active' },
    { id: 4, uom_name: 'Mtr', uom_type: 'Meter', status: 'Active' },
    { id: 5, uom_name: 'Kg', uom_type: 'Kilogram', status: 'Active' }
];

const mockAttributes = [
    { id: 1, attribute_name: 'Color', type: 'Select', description: 'Color variants', status: 'Active' },
    { id: 2, attribute_name: 'Storage', type: 'Select', description: 'Storage capacity', status: 'Active' },
    { id: 3, attribute_name: 'Lens Type', type: 'Select', description: 'Camera lens type', status: 'Active' },
    { id: 4, attribute_name: 'Resolution', type: 'Select', description: 'Camera resolution', status: 'Active' },
    { id: 5, attribute_name: 'Mounting Type', type: 'Select', description: 'Mounting options', status: 'Active' }
];

const mockPriceLists = [
    { id: 1, list_name: 'Standard Selling', currency: 'INR', applicable_to: 'Customer', description: 'Standard selling price', status: 'Active' },
    { id: 2, list_name: 'Dealer Selling', currency: 'INR', applicable_to: 'Customer', description: 'Dealer price', status: 'Active' },
    { id: 3, list_name: 'Project Price', currency: 'INR', applicable_to: 'Customer', description: 'Project discount price', status: 'Active' },
    { id: 4, list_name: 'AMC Price', currency: 'INR', applicable_to: 'Customer', description: 'AMC service price', status: 'Active' },
    { id: 5, list_name: 'Purchase Price', currency: 'INR', applicable_to: 'Supplier', description: 'Purchase price', status: 'Active' }
];

const mockTaxes = [
    { id: 1, tax_name: 'Standard GST', category: 'GST 18%', description: 'GST for standard items', status: 'Active' },
    { id: 2, tax_name: 'Reduced GST', category: 'GST 12%', description: 'GST for essential items', status: 'Active' },
    { id: 3, tax_name: 'Zero Rated', category: 'GST 0%', description: 'No GST', status: 'Active' },
    { id: 4, tax_name: 'Export', category: 'Export 0%', description: 'For export items', status: 'Active' },
    { id: 5, tax_name: 'Service Tax', category: 'Service', description: 'Service related items', status: 'Active' }
];

const mockSuppliers = [
    { id: 1, supplier_name: 'Hikvision India Pvt Ltd', code: 'SUP-001', contact_person: 'Aman Verma', phone: '+91 98765 43210', status: 'Active' },
    { id: 2, supplier_name: 'CP Plus Technologies', code: 'SUP-002', contact_person: 'Neha Sharma', phone: '+91 98123 45678', status: 'Active' },
    { id: 3, supplier_name: 'Dahua Technology', code: 'SUP-003', contact_person: 'Rahul Mehta', phone: '+91 98234 56789', status: 'Active' },
    { id: 4, supplier_name: 'TP-Link India', code: 'SUP-004', contact_person: 'Sandeep Patel', phone: '+91 98345 67890', status: 'Active' },
    { id: 5, supplier_name: 'Rashi Peripherals', code: 'SUP-005', contact_person: 'Kunal Mehta', phone: '+91 98456 78901', status: 'Active' }
];

const mockItems = [
    { id: 1, item_code: 'ITEM-CAM-0001', item_name: 'HIKVISION 2MP IP Camera', item_group: 'CCTV Cameras', brand: 'Hikvision', uom: 'Nos', status: 'Active' },
    { id: 2, item_code: 'ITEM-DVR-0001', item_name: '8 Channel DVR', item_group: 'CCTV Recorders', brand: 'Hikvision', uom: 'Nos', status: 'Active' },
    { id: 3, item_code: 'ITEM-SWI-0001', item_name: '24 Port PoE Switch', item_group: 'Network Switches', brand: 'TP-Link', uom: 'Nos', status: 'Active' },
    { id: 4, item_code: 'ITEM-CBL-0001', item_name: 'CAT6 Cable', item_group: 'Networking', brand: 'D-Link', uom: 'Box', status: 'Active' },
    { id: 5, item_code: 'ITEM-ACC-0001', item_name: 'Camera Mount', item_group: 'Accessories', brand: 'Generic', uom: 'Nos', status: 'Active' },
    { id: 6, item_code: 'ITEM-PSU-0001', item_name: '12V 5A Power Supply', item_group: 'Power Supplies', brand: 'Hikvision', uom: 'Nos', status: 'Active' },
    { id: 7, item_code: 'ITEM-MON-0001', item_name: '22" LED Monitor', item_group: 'Monitors', brand: 'Dell', uom: 'Nos', status: 'Active' },
    { id: 8, item_code: 'ITEM-SOFT-0001', item_name: 'VMS Software', item_group: 'Software License', brand: 'Hikvision', uom: 'Nos', status: 'Active' }
];

// --- Register Endpoints ---
createCrudEndpoints(router, 'item-groups', 'item_groups', mockItemGroups);
createCrudEndpoints(router, 'brands', 'brands', mockBrands);
createCrudEndpoints(router, 'uoms', 'uoms', mockUOMs);
createCrudEndpoints(router, 'item-attributes', 'item_attributes', mockAttributes);
createCrudEndpoints(router, 'price-lists', 'price_lists', mockPriceLists);
createCrudEndpoints(router, 'taxes', 'taxes', mockTaxes);
createCrudEndpoints(router, 'suppliers', 'suppliers', mockSuppliers);
createCrudEndpoints(router, 'items', 'items', mockItems);

// --- Dashboard Endpoint ---
router.get('/dashboard', async (req, res) => {
    try {
        const itemGroups = (await pool.query('SELECT COUNT(*) FROM item_groups')).rows[0].count;
        const brands = (await pool.query('SELECT COUNT(*) FROM brands')).rows[0].count;
        const items = (await pool.query('SELECT COUNT(*) FROM items')).rows[0].count;
        const uoms = (await pool.query('SELECT COUNT(*) FROM uoms')).rows[0].count;

        res.json({
            metrics: {
                itemGroups: parseInt(itemGroups) || 12,
                brands: parseInt(brands) || 28,
                items: parseInt(items) || 1248,
                uoms: parseInt(uoms) || 15
            },
            recentItems: mockItems.slice(0, 4) // mock for now, in real life you'd query ORDER BY created_at DESC LIMIT 4
        });
    } catch (err) {
        console.error('Error in products dashboard:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
