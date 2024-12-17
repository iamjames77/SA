const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    departure: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },
    budget: { type: Number, required: true },
    schedule: [
        {
            time: { type: String, required: true },
            activity: { type: String, required: true },
            location: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model('Trip', TripSchema);