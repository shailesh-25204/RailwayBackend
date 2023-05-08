const express = require('express')
const router = express.Router()
const Author = require("../models/train")
const Train = require('../models/train')

//* all authors route
router.get('/trains', async (req, res) => {
    let trains = await Train.find()
    res.send({two: 'hello'})
})

// Get trains from given Source and Destination
router.get('/getTrain', async (req, res) => {
    // console.log("hi")
    // console.log(req.query)
    const query = {
             'stops.stationName': { $in: [req.query.source] }, 'stops.stationName': { $in: [req.query.destination] } , 
              
    }
    // console.log(req.query);
    let trains = await Train.find(query)
    // console.log(trains);

    const filteredTrains = trains.filter(train => {
        const sourceIndex = train.stops.findIndex(stop => stop.stationName === req.query.source);
        const destIndex = train.stops.findIndex(stop => stop.stationName === req.query.destination);
        if (sourceIndex == -1 || destIndex == -1) {
            return false;
        }
        if (sourceIndex !== -1 && destIndex !== -1) {
            return (sourceIndex < destIndex); // Only include trains where source comes before destination in the stops array
        }
        return false;
    });
    res.send(filteredTrains)

})


async function trainsJSON_to_CSV() {
    try {
        let trains = await Train.find({})
        // console.log(trains); // prints an array of all trains
        const headers = ['trainName', 'trainNumber', 'journeyDate', 'journeyTime', 'acCoaches', 'sleeperCoaches', 'source', 'destination', 'stops'];
        const data = trains.map(train => {
            return {
                trainName: train.trainName,
                trainNumber: train.trainNumber,
                journeyDate: train.journeyDate,
                journeyTime: train.journeyTime,
                acCoaches: train.acCoaches.join(', '),
                sleeperCoaches: train.sleeperCoaches.join(', '),
                source: train.source,
                destination: train.destination,
                stops: JSON.stringify(train.stops)
            };
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Train Details');
        XLSX.writeFile(workbook, 'train-details.xlsx');
        console.log('Excel file created successfully!');

    } catch (error) {
        console.log(error);
    }
}
module.exports = router