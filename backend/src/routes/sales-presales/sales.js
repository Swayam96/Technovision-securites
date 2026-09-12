const express = require('express');
const router = express.Router();
const { pool } = require('../../db');

// --- Dashboard Endpoints ---

router.get('/dashboard', async (req, res) => {
    try {
        // In a real application, these would be aggregations from the database.
        // For now, we'll return mock data matching the UI or simple counts.
        
        // 1. Top level metrics
        const totalLeadsRes = await pool.query("SELECT COUNT(*) FROM leads");
        const totalLeads = parseInt(totalLeadsRes.rows[0].count) || 124; // fallback to UI mockup
        
        const totalOppsRes = await pool.query("SELECT COUNT(*) FROM opportunities");
        const totalOpps = parseInt(totalOppsRes.rows[0].count) || 78;

        const totalQtnsRes = await pool.query("SELECT COUNT(*) FROM quotations");
        const totalQtns = parseInt(totalQtnsRes.rows[0].count) || 56;

        const totalOrdersRes = await pool.query("SELECT COUNT(*) FROM sales_orders");
        const totalOrders = parseInt(totalOrdersRes.rows[0].count) || 42;

        // 2. Sales Pipeline (Value over time) - mock data matching UI
        const pipelineData = [
            { month: 'Jan', leads: 4, opportunity: 3, quotation: 2, salesOrder: 1 },
            { month: 'Feb', leads: 5, opportunity: 4, quotation: 3, salesOrder: 2 },
            { month: 'Mar', leads: 6, opportunity: 5, quotation: 4, salesOrder: 2 },
            { month: 'Apr', leads: 7, opportunity: 6, quotation: 4, salesOrder: 3 },
            { month: 'May', leads: 9, opportunity: 7, quotation: 5, salesOrder: 4 },
            { month: 'Jun', leads: 12, opportunity: 9, quotation: 7, salesOrder: 5 },
            { month: 'Jul', leads: 15, opportunity: 12, quotation: 9, salesOrder: 6 },
            { month: 'Aug', leads: 18, opportunity: 14, quotation: 11, salesOrder: 8 },
            { month: 'Sep', leads: 22, opportunity: 18, quotation: 14, salesOrder: 10 }
        ];

        // 3. Opportunity by Stage
        const opportunityByStage = [
            { name: 'Qualification', value: 25, fill: '#3b82f6' },
            { name: 'Proposal', value: 18, fill: '#22c55e' },
            { name: 'Negotiation', value: 25, fill: '#f59e0b' },
            { name: 'Won', value: 10, fill: '#14b8a6' },
            { name: 'Lost', value: 0, fill: '#ef4444' }
        ];

        // 4. Recent Activities (Mock)
        const recentActivities = [
            { id: 1, title: 'New lead added - ABC Technologies', time: '2 hours ago', icon: 'fas fa-user-plus', color: 'text-primary' },
            { id: 2, title: 'Quotation QTN-00045 sent to Secure Vision', time: '4 hours ago', icon: 'fas fa-file-invoice', color: 'text-info' },
            { id: 3, title: 'Sales Order SO-00035 confirmed', time: '1 day ago', icon: 'fas fa-check-circle', color: 'text-success' },
            { id: 4, title: 'Customer meeting scheduled with City Surveillance', time: '1 day ago', icon: 'fas fa-calendar-alt', color: 'text-warning' }
        ];

        // 5. My Tasks (Mock)
        const myTasks = [
            { id: 1, title: 'Follow up with Global Tech', due: 'Today', urgent: true },
            { id: 2, title: 'Send revised BOQ to Metro Infra', due: 'Today', urgent: true },
            { id: 3, title: 'Prepare proposal for Safe Home Solutions', due: 'Tomorrow', urgent: false },
            { id: 4, title: 'Call with ABC Technologies', due: 'Tomorrow', urgent: false }
        ];

        res.json({
            metrics: {
                totalLeads,
                leadsTrend: '+8%',
                totalOpps,
                oppsTrend: '+11%',
                totalQtns,
                qtnsTrend: '+5%',
                totalOrders,
                ordersTrend: '+15%'
            },
            pipelineData,
            opportunityByStage,
            recentActivities,
            myTasks
        });
    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Leads Endpoints ---

router.get('/leads', async (req, res) => {
    try {
        const leadsRes = await pool.query("SELECT * FROM leads ORDER BY created_on DESC");
        // If DB is empty, provide mock data from the UI
        let leads = leadsRes.rows;
        if (leads.length === 0) {
            leads = [
                { id: 1, lead_name: 'ABC Technologies', company: 'ABC Technologies', source: 'Website', assigned_to: 'Suraj Jadhav', status: 'New', created_on: '04 Sep 2026' },
                { id: 2, lead_name: 'Secure Vision', company: 'Secure Vision', source: 'Referral', assigned_to: 'Suraj Jadhav', status: 'Contacted', created_on: '03 Sep 2026' },
                { id: 3, lead_name: 'City Surveillance', company: 'City Surveillance', source: 'Trade Show', assigned_to: 'Prasad Singh', status: 'Qualified', created_on: '02 Sep 2026' },
                { id: 4, lead_name: 'Future Tech', company: 'Future Tech', source: 'Website', assigned_to: 'Rohit Sharma', status: 'New', created_on: '02 Sep 2026' },
                { id: 5, lead_name: 'Metro Infra', company: 'Metro Infra', source: 'Direct', assigned_to: 'Suraj Jadhav', status: 'Proposal', created_on: '01 Sep 2026' },
                { id: 6, lead_name: 'Safe Home Solutions', company: 'Safe Home', source: 'Referral', assigned_to: 'Prasad Singh', status: 'Negotiation', created_on: '31 Aug 2026' },
                { id: 7, lead_name: 'Retail Mart', company: 'Retail Mart', source: 'Email', assigned_to: 'Rohit Sharma', status: 'New', created_on: '31 Aug 2026' }
            ];
        }
        res.json(leads);
    } catch (err) {
        console.error("Leads error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/leads/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM leads WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/leads', async (req, res) => {
    try {
        const { lead_name, company, source, assigned_to, status } = req.body;
        // mock formatting date for created_on string
        const created_on = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const result = await pool.query(
            "INSERT INTO leads (lead_name, company, source, assigned_to, status, created_on) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [lead_name, company, source, assigned_to, status, created_on]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/leads/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { lead_name, company, source, assigned_to, status } = req.body;
        
        const result = await pool.query(
            "UPDATE leads SET lead_name = $1, company = $2, source = $3, assigned_to = $4, status = $5 WHERE id = $6 RETURNING *",
            [lead_name, company, source, assigned_to, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Contacts Endpoints ---

router.get('/contacts', async (req, res) => {
    try {
        const contactsRes = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
        // If DB is empty, provide mock data from the UI
        let contacts = contactsRes.rows;
        if (contacts.length === 0) {
            contacts = [
                { id: 1, full_name: 'Amit Verma', company: 'ABC Technologies', designation: 'Purchase Manager', email: 'amit@abctech.in', phone: '+91 98765 43210', status: 'Active' },
                { id: 2, full_name: 'Neha Kulkarni', company: 'Secure Vision', designation: 'Director', email: 'neha@securevision.in', phone: '+91 98123 45678', status: 'Active' },
                { id: 3, full_name: 'Rahul Mehta', company: 'City Surveillance', designation: 'Project Head', email: 'rahul@citysurv.in', phone: '+91 98234 56789', status: 'Active' },
                { id: 4, full_name: 'Pooja Deshmukh', company: 'Future Tech', designation: 'Admin', email: 'pooja@futuretech.in', phone: '+91 98345 67890', status: 'Active' },
                { id: 5, full_name: 'Vikram Rao', company: 'Metro Infra', designation: 'Procurement', email: 'vikram@metroinfra.in', phone: '+91 98456 78901', status: 'Active' },
                { id: 6, full_name: 'Sonal Patil', company: 'Safe Home', designation: 'CEO', email: 'sonal@safehome.in', phone: '+91 98567 89012', status: 'Active' },
                { id: 7, full_name: 'Karan Shetty', company: 'Retail Mart', designation: 'Store Manager', email: 'karan@retailmart.in', phone: '+91 98678 90123', status: 'Active' }
            ];
        }
        res.json(contacts);
    } catch (err) {
        console.error("Contacts error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM contacts WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/contacts', async (req, res) => {
    try {
        const { full_name, company, designation, email, phone, status } = req.body;
        const result = await pool.query(
            "INSERT INTO contacts (full_name, company, designation, email, phone, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [full_name, company, designation, email, phone, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/contacts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, company, designation, email, phone, status } = req.body;
        const result = await pool.query(
            "UPDATE contacts SET full_name = $1, company = $2, designation = $3, email = $4, phone = $5, status = $6 WHERE id = $7 RETURNING *",
            [full_name, company, designation, email, phone, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Customers Endpoints ---

router.get('/customers', async (req, res) => {
    try {
        const customersRes = await pool.query("SELECT * FROM customers ORDER BY created_at DESC");
        let customers = customersRes.rows;
        if (customers.length === 0) {
            customers = [
                { id: 1, customer_name: 'ABC Technologies', customer_group: 'Corporate', city: 'Mumbai', state: 'Maharashtra', status: 'Active' },
                { id: 2, customer_name: 'Secure Vision', customer_group: 'Dealer', city: 'Pune', state: 'Maharashtra', status: 'Active' },
                { id: 3, customer_name: 'City Surveillance', customer_group: 'Installer', city: 'Nashik', state: 'Maharashtra', status: 'Active' },
                { id: 4, customer_name: 'Future Tech', customer_group: 'Corporate', city: 'Bengaluru', state: 'Karnataka', status: 'Active' },
                { id: 5, customer_name: 'Metro Infra', customer_group: 'Government', city: 'Mumbai', state: 'Maharashtra', status: 'Active' },
                { id: 6, customer_name: 'Safe Home Solutions', customer_group: 'Retail', city: 'Pune', state: 'Maharashtra', status: 'Active' },
                { id: 7, customer_name: 'Retail Mart', customer_group: 'Retail', city: 'Nagpur', state: 'Maharashtra', status: 'Active' },
                { id: 8, customer_name: 'EduTech', customer_group: 'Institutional', city: 'Mumbai', state: 'Maharashtra', status: 'Active' },
                { id: 9, customer_name: 'HealthCare Plus', customer_group: 'Healthcare', city: 'Pune', state: 'Maharashtra', status: 'Active' },
                { id: 10, customer_name: 'Industrial Systems', customer_group: 'Corporate', city: 'Aurangabad', state: 'Maharashtra', status: 'Active' }
            ];
        }
        res.json(customers);
    } catch (err) {
        console.error("Customers error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM customers WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/customers', async (req, res) => {
    try {
        const { customer_name, customer_group, city, state, status } = req.body;
        const result = await pool.query(
            "INSERT INTO customers (customer_name, customer_group, city, state, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [customer_name, customer_group, city, state, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/customers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { customer_name, customer_group, city, state, status } = req.body;
        const result = await pool.query(
            "UPDATE customers SET customer_name = $1, customer_group = $2, city = $3, state = $4, status = $5 WHERE id = $6 RETURNING *",
            [customer_name, customer_group, city, state, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Opportunities Endpoints ---

router.get('/opportunities', async (req, res) => {
    try {
        const oppsRes = await pool.query("SELECT * FROM opportunities ORDER BY created_at DESC");
        let opps = oppsRes.rows;
        if (opps.length === 0) {
            opps = [
                { id: 1, opportunity_name: 'CCTV Upgrade', account: 'ABC Technologies', stage: 'Qualification', expected_value: 500000, expected_close: '30 Sep 2026', probability: 20 },
                { id: 2, opportunity_name: 'Branch Expansion', account: 'Secure Vision', stage: 'Proposal', expected_value: 1250000, expected_close: '15 Oct 2026', probability: 60 },
                { id: 3, opportunity_name: 'City Project', account: 'City Surveillance', stage: 'Negotiation', expected_value: 1375000, expected_close: '25 Oct 2026', probability: 70 },
                { id: 4, opportunity_name: 'Campus Security', account: 'EduTech', stage: 'Proposal', expected_value: 820000, expected_close: '10 Nov 2026', probability: 50 },
                { id: 5, opportunity_name: 'Warehouse Setup', account: 'Retail Mart', stage: 'Proposal', expected_value: 640000, expected_close: '12 Nov 2026', probability: 50 },
                { id: 6, opportunity_name: 'Hospital Surveillance', account: 'HealthCare Plus', stage: 'Negotiation', expected_value: 1520000, expected_close: '30 Nov 2026', probability: 70 },
                { id: 7, opportunity_name: 'Factory Security', account: 'Industrial Systems', stage: 'Proposal', expected_value: 2200000, expected_close: '10 Dec 2026', probability: 60 },
                { id: 8, opportunity_name: 'Smart Office', account: 'Future Tech', stage: 'Qualification', expected_value: 750000, expected_close: '15 Dec 2026', probability: 25 },
                { id: 9, opportunity_name: 'Metro Line CCTV', account: 'Metro Infra', stage: 'Negotiation', expected_value: 4500000, expected_close: '20 Dec 2026', probability: 80 },
                { id: 10, opportunity_name: 'Retail Chain', account: 'Safe Home Solutions', stage: 'Proposal', expected_value: 960000, expected_close: '05 Jan 2027', probability: 55 }
            ];
        }
        res.json(opps);
    } catch (err) {
        console.error("Opportunities error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/opportunities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM opportunities WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/opportunities', async (req, res) => {
    try {
        const { opportunity_name, account, stage, expected_value, expected_close, probability } = req.body;
        const result = await pool.query(
            "INSERT INTO opportunities (opportunity_name, account, stage, expected_value, expected_close, probability) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [opportunity_name, account, stage, expected_value, expected_close, probability]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/opportunities/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { opportunity_name, account, stage, expected_value, expected_close, probability } = req.body;
        const result = await pool.query(
            "UPDATE opportunities SET opportunity_name = $1, account = $2, stage = $3, expected_value = $4, expected_close = $5, probability = $6 WHERE id = $7 RETURNING *",
            [opportunity_name, account, stage, expected_value, expected_close, probability, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Quotations Endpoints ---

router.get('/quotations', async (req, res) => {
    try {
        const qtnsRes = await pool.query("SELECT * FROM quotations ORDER BY created_at DESC");
        let qtns = qtnsRes.rows;
        if (qtns.length === 0) {
            qtns = [
                { id: 1, qtn_no: 'QTN-00045', date: '04 Sep 2026', customer: 'Secure Vision', subject: 'CCTV for Branch', amount: 1250000, status: 'Sent' },
                { id: 2, qtn_no: 'QTN-00044', date: '03 Sep 2026', customer: 'ABC Technologies', subject: 'Office Surveillance', amount: 525000, status: 'Sent' },
                { id: 3, qtn_no: 'QTN-00043', date: '02 Sep 2026', customer: 'City Surveillance', subject: 'City Project', amount: 1875000, status: 'Draft' },
                { id: 4, qtn_no: 'QTN-00042', date: '01 Sep 2026', customer: 'EduTech', subject: 'Campus Security', amount: 820000, status: 'Viewed' },
                { id: 5, qtn_no: 'QTN-00041', date: '31 Aug 2026', customer: 'Retail Mart', subject: 'Warehouse Setup', amount: 640000, status: 'Accepted' },
                { id: 6, qtn_no: 'QTN-00040', date: '30 Aug 2026', customer: 'HealthCare Plus', subject: 'Hospital Surveillance', amount: 1520000, status: 'Sent' },
                { id: 7, qtn_no: 'QTN-00039', date: '29 Aug 2026', customer: 'Industrial Systems', subject: 'Factory Security', amount: 2200000, status: 'Draft' },
                { id: 8, qtn_no: 'QTN-00038', date: '28 Aug 2026', customer: 'Future Tech', subject: 'Smart Office', amount: 750000, status: 'Expired' },
                { id: 9, qtn_no: 'QTN-00037', date: '27 Aug 2026', customer: 'Metro Infra', subject: 'Metro Line CCTV', amount: 4500000, status: 'Sent' },
                { id: 10, qtn_no: 'QTN-00036', date: '26 Aug 2026', customer: 'Safe Home Solutions', subject: 'Retail Chain', amount: 960000, status: 'Accepted' }
            ];
        }
        res.json(qtns);
    } catch (err) {
        console.error("Quotations error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/quotations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM quotations WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/quotations', async (req, res) => {
    try {
        const { qtn_no, date, customer, subject, amount, status } = req.body;
        const result = await pool.query(
            "INSERT INTO quotations (qtn_no, date, customer, subject, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [qtn_no, date, customer, subject, amount, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/quotations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { qtn_no, date, customer, subject, amount, status } = req.body;
        const result = await pool.query(
            "UPDATE quotations SET qtn_no = $1, date = $2, customer = $3, subject = $4, amount = $5, status = $6 WHERE id = $7 RETURNING *",
            [qtn_no, date, customer, subject, amount, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- BOQ / Solutions Endpoints ---

router.get('/boq-solutions', async (req, res) => {
    try {
        const boqRes = await pool.query("SELECT * FROM boq_solutions ORDER BY created_at DESC");
        let boqs = boqRes.rows;
        if (boqs.length === 0) {
            boqs = [
                { id: 1, boq_no: 'BOQ-00019', project: 'City Project', customer: 'City Surveillance', type: 'New Installation', amount: 1875000, status: 'Approved' },
                { id: 2, boq_no: 'BOQ-00018', project: 'Office Upgrade', customer: 'ABC Technologies', type: 'Upgrade', amount: 525000, status: 'Sent' },
                { id: 3, boq_no: 'BOQ-00017', project: 'Campus Security', customer: 'EduTech', type: 'New Installation', amount: 820000, status: 'Sent' },
                { id: 4, boq_no: 'BOQ-00016', project: 'Warehouse', customer: 'Retail Mart', type: 'New Installation', amount: 640000, status: 'Approved' },
                { id: 5, boq_no: 'BOQ-00015', project: 'Hospital', customer: 'HealthCare Plus', type: 'Upgrade', amount: 1520000, status: 'Draft' },
                { id: 6, boq_no: 'BOQ-00014', project: 'Factory', customer: 'Industrial Systems', type: 'New Installation', amount: 2200000, status: 'Draft' },
                { id: 7, boq_no: 'BOQ-00013', project: 'Metro Line', customer: 'Metro Infra', type: 'New Installation', amount: 4500000, status: 'Sent' },
                { id: 8, boq_no: 'BOQ-00012', project: 'Smart Office', customer: 'Future Tech', type: 'Upgrade', amount: 750000, status: 'Draft' },
                { id: 9, boq_no: 'BOQ-00011', project: 'Retail Chain', customer: 'Safe Home Solutions', type: 'New Installation', amount: 960000, status: 'Approved' },
                { id: 10, boq_no: 'BOQ-00010', project: 'Branch Expansion', customer: 'Secure Vision', type: 'New Installation', amount: 1250000, status: 'Sent' }
            ];
        }
        res.json(boqs);
    } catch (err) {
        console.error("BOQ error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/boq-solutions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM boq_solutions WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/boq-solutions', async (req, res) => {
    try {
        const { boq_no, project, customer, type, amount, status } = req.body;
        const result = await pool.query(
            "INSERT INTO boq_solutions (boq_no, project, customer, type, amount, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [boq_no, project, customer, type, amount, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/boq-solutions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { boq_no, project, customer, type, amount, status } = req.body;
        const result = await pool.query(
            "UPDATE boq_solutions SET boq_no = $1, project = $2, customer = $3, type = $4, amount = $5, status = $6 WHERE id = $7 RETURNING *",
            [boq_no, project, customer, type, amount, status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Sales Orders Endpoints ---

router.get('/sales-orders', async (req, res) => {
    try {
        const soRes = await pool.query("SELECT * FROM sales_orders ORDER BY created_at DESC");
        let sos = soRes.rows;
        if (sos.length === 0) {
            sos = [
                { id: 1, order_no: 'SO-00021', date: '04 Sep 2026', customer: 'Retail Mart', amount: 640000, status: 'Confirmed', payment_status: 'Pending' },
                { id: 2, order_no: 'SO-00020', date: '01 Sep 2026', customer: 'Safe Home Solutions', amount: 960000, status: 'In Progress', payment_status: 'Partial' },
                { id: 3, order_no: 'SO-00019', date: '28 Aug 2026', customer: 'ABC Technologies', amount: 525000, status: 'Delivered', payment_status: 'Paid' },
                { id: 4, order_no: 'SO-00018', date: '25 Aug 2026', customer: 'City Surveillance', amount: 1875000, status: 'Confirmed', payment_status: 'Pending' },
                { id: 5, order_no: 'SO-00017', date: '20 Aug 2026', customer: 'Secure Vision', amount: 1250000, status: 'Delivered', payment_status: 'Paid' }
            ];
        }
        res.json(sos);
    } catch (err) {
        console.error("Sales Orders error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/sales-orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM sales_orders WHERE id = $1", [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/sales-orders', async (req, res) => {
    try {
        const { order_no, date, customer, amount, status, payment_status } = req.body;
        const result = await pool.query(
            "INSERT INTO sales_orders (order_no, date, customer, amount, status, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [order_no, date, customer, amount, status, payment_status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/sales-orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { order_no, date, customer, amount, status, payment_status } = req.body;
        const result = await pool.query(
            "UPDATE sales_orders SET order_no = $1, date = $2, customer = $3, amount = $4, status = $5, payment_status = $6 WHERE id = $7 RETURNING *",
            [order_no, date, customer, amount, status, payment_status, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
