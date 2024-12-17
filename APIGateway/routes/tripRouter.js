const express = require('express');
const axios = require('axios');
const router = express.Router();
const { TRIP_SERVICE_URL } = process.env;

router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`${TRIP_SERVICE_URL}/trip`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Trip Service Error:', error.message);
        res.status(500).json({ error: 'Failed to connect to Trip Service' });
    }
});

module.exports = router;