const express = require('express')
const router = express.Router()
const Booking = require('../models/bookings');
const { isAuth } = require('../controller/auth-user');

router.get('/getBookings', isAuth, async (req,res) => {
    // console.log(req.user)
    
    const userBookings = await Booking.find({userId: req.user._id})
    console.log(userBookings)
    res.sendStatus(200)
})

router.post('/book',isAuth,  (req, res) => {

    let passengerDetails = req.body.passengerObj;
    const trainObj = req.body.trainObj
    // console.log(passengerDetails)
    const booking = new Booking({
        train: trainObj,
        userId: req.user._id,
        passengerDetails: [passengerDetails],
    });

    booking.save()
        .then(() => {
            console.log('Data saved successfully');
        })
        .catch((err) => {
            console.error(err);
        });

    res.send('hi hi')

})
module.exports = router