const express = require('express')
const router = express.Router()
const Booking = require('../models/bookings');
const Train = require('../models/train');
const { isAuth } = require('../controller/auth-user');
const train = require('../models/train');

router.get('/getBookings', isAuth, async (req,res) => {
    // console.log(req.user)
    
    const  bookings =  await Booking.find({userId: req.user._id})
    res.send(bookings)
    // console.log(userBookings)

})

router.post('/book',isAuth, async (req, res) => {

    let passengerDetails = req.body.passengerObj;
    const trainObj = req.body.trainObj
    // console.log(req.user)
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
        let array = undefined 
        if(trainObj.isAC){
            array = trainObj.acArray        }
        else{
            array = trainObj.sleeperArray
        }
        
        let passengers = passengerDetails.length
        let index = 0
        console.log(array)
        while(passengers > 0){
            let val = parseInt(array[index])
            let t = Math.min(val , passengers)
            console.log([val,t])
            val = val - t;
            passengers -= t;
            array[index] = val + ""
            index +=1
        }
        let query = null
        if(trainObj.isAC){
            query = {acCoaches: array}
        }
        else{
            query = {sleeperCoaches: array}
        }

        await train.findByIdAndUpdate(trainObj.id,query)

    res.send('')

})
module.exports = router