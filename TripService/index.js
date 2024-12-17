const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tripController = require('./tripController');
const app = express();

const PORT = process.env.PORT || 3001;

// MongoDB 연결 설정
mongoose.connect('mongodb://mongodb:27017/trip-planner', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());

// GET 요청 처리 (브라우저 접속 확인용)
app.get('/', (req, res) => {
    res.send('Trip Service is running!');
});

// 여행 일정 생성 엔드포인트
app.post('/trip', tripController.createTripPlan);

// 서버 실행
app.listen(PORT, () => {
    console.log(`Trip Service is running on port ${PORT}`);
});