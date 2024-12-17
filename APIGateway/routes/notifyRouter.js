const express = require('express');
const axios = require('axios');
const router = express.Router();
const { NOTIFY_SERVICE_URL } = process.env;

router.post('/', async (req, res) => {
    try {
        const response = await axios.post(`${NOTIFY_SERVICE_URL}/notify`, req.body);
        res.json(response.data);
    } catch (error) {
        console.error('Notification Service Error:', error.message);
        res.status(500).json({ error: 'Failed to connect to Notification Service' });
    }
});

module.exports = router;