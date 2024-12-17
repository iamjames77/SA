const Trip = require('./tripModel');

const createTripPlan = async (req, res) => {
    try {
        // 클라이언트로부터 전달된 데이터
        const { departure, destination, date, budget, schedule } = req.body;

        // 입력값 검증
        if (!departure || !destination || !date || !budget || !schedule) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // 새로운 Trip 문서 생성
        const newTrip = new Trip({
            departure,
            destination,
            date,
            budget,
            schedule,
        });

        // MongoDB에 저장
        const savedTrip = await newTrip.save();

        // 성공 응답 반환
        res.status(201).json({
            message: 'Trip plan saved successfully',
            data: savedTrip,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createTripPlan };