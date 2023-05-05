const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainName: {
        type: String,
        required: true
    },
    trainNumber: {
        type: String,
        required: true
    },
    journeyDate: {
        type: Date,
        required: true
    },
    journeyTime: {
        type: String,
        required: true
    },
    acCoaches: {
        type: [String],
        required: true
    },
    sleeperCoaches: {
        type: [String],
        required: true
    },
    source: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    stops: [{
        stationName: String,
        arrivalTime: String,
        departureTime: String,
        duration: String
    }]
}, { collection: 'trains' });

module.exports = mongoose.model('Train', trainSchema)