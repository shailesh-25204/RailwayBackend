const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
    trainName: {
        type: String,
        required: true
    },
    trainNumber: {
        type: Number,
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
    acCoaches: [{
        capacity: Number
    }],
    sleeperCoaches: [{
        capacity: Number
    }],
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
});

module.exports = mongoose.model('Train', trainSchema)