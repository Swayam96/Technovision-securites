const express = require('express');
const router = express.Router();
const MODULES = require('../modules.json');

router.get('/', (req, res) => {
    try {
        res.json(MODULES);
    } catch (e) {
        console.error('Error reading modules.json', e);
        res.status(500).json({ error: 'Failed to fetch modules' });
    }
});

module.exports = router;
