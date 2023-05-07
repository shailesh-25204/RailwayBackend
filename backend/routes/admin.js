const express = require('express')
const router = express.Router()
const Train = require('../models/train');
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const { trainsCollection }=  require('../server');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, 'someFile');
    },
});

const upload = multer({ storage: storage });


router.post("/uploadCSV", upload.single("file"), (req, res) => {
    res.send("hello from trains post");
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data",async (data) => {
            results.push(data)
            const trainData = results[results.length - 1]
            console.log(trainData)
            const trainName = trainData.trainName
            const trainNumber = trainData.trainNumber
            const journeyDate = trainData.journeyDate
            const journeyTime = trainData.journeyTime
            const acCoaches = trainData.acCoaches
            const sleeperCoaches = trainData.sleeperCoaches
            const source = trainData.source
            const destination = trainData.destination
            const stopsArray = eval(trainData.stops)
            // let arrtemp = trainData.stops
            // arrtemp.slice(1,arrtemp.length -1)
            // stopsArray = arrtemp
            // console.log(typeof(stopsArray))
            
            let newTrain = new Train({ trainName: trainName, trainNumber: trainNumber, journeyDate: journeyDate, journeyTime, journeyTime: journeyTime, acCoaches: acCoaches, sleeperCoaches: sleeperCoaches, source: source, destination: destination, stops: stopsArray })
            trainsCollection.insertOne(newTrain)
        })
        .on("end", () => {
            // console.log(results[results.length - 1].stops)
            console.log("data insertion ended");
        });
});

module.exports = router