const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    train: {
        type: Object,
        required: true,
    },
    userId: {
        type: String
    },
    passengerDetails: [[{
        name: {
            type: String,
            required: true,
        },
        age: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        seatNo: {
            type: String,
            //   required: true,
        },
        berthType: {
            type: String,
            required: true,
        },
    }]],
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;