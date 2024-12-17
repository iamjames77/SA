require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3002;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/route', async (req, res) => {
    const { origin, waypoints, destination } = req.body;

    // 입력 유효성 검사
    if (!origin || !destination || !Array.isArray(waypoints)) {
        return res.status(400).json({ message: 'Invalid input: origin, destination, and waypoints are required.' });
    }

    // Google Directions API URL (대중교통 모드 추가)
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=optimize:true|${waypoints.map(wp => encodeURIComponent(wp)).join('|')}&mode=transit&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);

        // Google API 오류 처리
        if (response.data.status !== 'OK') {
            console.error('Google API Error:', response.data);
            return res.status(500).json({
                message: 'Failed to retrieve route from Google API',
                error: response.data.status,
            });
        }

        // 성공 시 최적화된 경로 반환
        res.json({
            optimizedWaypointsOrder: response.data.routes[0].waypoint_order,
            routeSummary: response.data.routes[0].summary,
            legs: response.data.routes[0].legs.map(leg => ({
                startAddress: leg.start_address,
                endAddress: leg.end_address,
                distance: leg.distance.text,
                duration: leg.duration.text,
            })),
        });
    } catch (error) {
        console.error('Error fetching directions:', error.message);
        res.status(500).json({
            message: 'Internal server error while optimizing route',
            error: error.message,
        });
    }
});

app.listen(PORT, () => console.log(`Route Optimizer running on port ${PORT}`));