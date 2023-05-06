const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Train = require('./models/train');
const trainsRouter = require('./routes/trains')
const cors = require('cors')
const XLSX = require('xlsx');
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");



const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/train-details'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(getAllTrains())
const db = mongoose.connection
const trains = db.collection('trains')
db.once('open', () => console.log('Connected to Database'))

// trains.insertOne({
//     trainName: "name",
//     trainNumber: "12345",
//     journeyDate: new Date('10-5-23'),
//     journeyTime: "time",
//     acCoaches: ['1', '2', '3'],
//     sleeperCoaches: ['s1', 's2', 's3', 's4'],
//     source: 'source',
//     destination: 'deset',
//     stops: [{
//         'stationName': 'stname',
//         'arrivalTime': 'attime',
//         'departureTime': 'dpttime',
//         'duration': 'dura'
//     }]
// })

trains.deleteMany({})


app.use(bodyParser.json());
app.use('/trains', trainsRouter)
app.use(express.json());
app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, 'someFile');
    },
});

const upload = multer({ storage: storage });

app.post("/trains", upload.single("file"), (req, res) => {
    res.send("hello from trains post");
    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => {
            results.push(data)
            let trainData = results[results.length - 1]
            // console.log(typeof (trainData));
            // console.log(trainData);
            let trainName = trainData.trainName
            let trainNumber = trainData.trainNumber
            let journeyDate = trainData.journeyDate
            let journeyTime = trainData.journeyTime
            let acCoaches = trainData.acCoaches
            let sleeperCoaches = trainData.sleeperCoaches
            let source = trainData.source
            let destination = trainData.destination
            let tempStops = trainData.stops

            let newTrain = new Train({ trainName: trainName, trainNumber: trainNumber, journeyDate: journeyDate, journeyTime, journeyTime: journeyTime, acCoaches: acCoaches, sleeperCoaches: sleeperCoaches, source: source, destination: destination, stops: tempStops })
            trains.insertOne(newTrain)
            // console.log(tempStops);

            // console.log(results);
        })
        .on("end", () => {
            console.log("data insertion ended");
        });
});

app.get("/", async (req, res) => {
    let trains = await Train.find()
    res.send({ some: trains })
});


app.get('/api/getTrain', async (req, res) => {
    const query = {
        $or: [
            { source: req.query.source, destination: req.query.destination },
            { 'stops.stationName': { $in: [req.query.source] }, 'stops.stationName': { $in: [req.query.destination] } }
        ],
        // journeyDate: req.query.date
    }
    console.log(req.query);
    let trains = await Train.find(query)
    console.log(trains);

    const filteredTrains = trains.filter(train => {
        const sourceIndex = train.stops.findIndex(stop => stop.stationName === req.query.source);
        const destIndex = train.stops.findIndex(stop => stop.stationName === req.query.destination);
        console.log(sourceIndex);
        console.log(destIndex);
        if (sourceIndex == -1 || destIndex == -1) {
            return false;
        }
        if (sourceIndex !== -1 && destIndex !== -1) {
            return (sourceIndex < destIndex); // Only include trains where source comes before destination in the stops array
        }
        return false;
    });
    console.log(filteredTrains);
    res.send(filteredTrains)

    // res.json(filteredTrains);
    // console.log(trains);
    // res.send(trains)
})



// app.get('/trains', async (req, res) => {
//     let trains = await Train.find()
//     // var json = trains.
//     res.send(trains)
// })


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


async function getAllTrains() {
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

async function findTrainsWithSrcDest(journeyinfo) {
    console.log('findtrains');
    let source = journeyinfo.source
    let dest = journeyinfo.dest
    const query = {
        source: { $regex: source, $options: 'i' },
        destination: { $regex: dest, $options: 'i' }
        // source: source,
        // destination: dest
    };
    let trains = await Train.find(query)
        .then(res => {
            trainSrc = res
            console.log(res);
        })
        .catch(e => {
            console.log(e);
        })
}

