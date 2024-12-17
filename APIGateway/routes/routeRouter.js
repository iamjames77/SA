const express = require('express');
const axios = require('axios');
const router = express.Router();
const { ROUTE_SERVICE_URL } = process.env;

router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`${ROUTE_SERVICE_URL}/optimize`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Route Optimizer Error:', error.message);
        res.status(500).json({ error: 'Failed to connect to Route Optimizer Service' });
    }
});

module.exports = router;