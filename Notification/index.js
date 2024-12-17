const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

app.post('/notify', (req, res) => {
    const { userId, message } = req.body;
    res.json({ status: 'Notification Sent', userId, message });
});

app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});