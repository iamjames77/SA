require('dotenv').config();
const express = require('express');
const tripRouter = require('./routes/tripRouter');
const routeRouter = require('./routes/routeRouter');
const notifyRouter = require('./routes/notifyRouter');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// 라우터 설정
app.use('/trip', tripRouter);
app.use('/route', routeRouter);
app.use('/notify', notifyRouter);

// 기본 라우트
app.get('/', (req, res) => {
    res.send('API Gateway is running');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});