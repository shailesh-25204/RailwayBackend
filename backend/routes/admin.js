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
            let trainData = results[results.length - 1]
            // console.log(trainData)
            let trainName = trainData.trainName
            let trainNumber = trainData.trainNumber
            let journeyDate = trainData.journeyDate
            let journeyTime = trainData.journeyTime
            let acCoaches = eval(trainData.acCoaches)
            let sleeperCoaches = eval(trainData.sleeperCoaches)
            let source = trainData.source
            let destination = trainData.destination
            let stopsArray = eval(trainData.stops)
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