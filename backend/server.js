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
const { log } = require('console');
const train = require('./models/train');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/train-details'

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(getAllTrains())
const db = mongoose.connection
const trains = db.collection('trains')
db.once('open', () => console.log('Connected to Database'))

// const newTrain = new Train({
//     trainName: 'Rajdhani Express',
//     trainNumber: '1234',
//     journeyDate: new Date('2023-05-10'),
//     journeyTime: '8:00 AM',
//     acCoaches: ['A1', 'A2', 'A3'],
//     sleeperCoaches: ['S1', 'S2', 'S3'],
//     source: 'Delhi',
//     destination: 'Mumbai',
//     stops: [
//         { stationName: 'Jaipur', arrivalTime: '11:00 AM', departureTime: '11:10 AM', duration: '10 minutes' },
//         { stationName: 'Ahmedabad', arrivalTime: '2:00 PM', departureTime: '2:15 PM', duration: '15 minutes' },
//         { stationName: 'Surat', arrivalTime: '5:00 PM', departureTime: '5:05 PM', duration: '5 minutes' },
//         { stationName: 'Vadodara', arrivalTime: '4:00 PM', departureTime: '4:10 PM', duration: '10 minutes' },
//     ]
// });

// newTrain.save()
//     .then(res => {
//         console.log(res)
//     })
//     .catch(e => {
//         console.log(e)
//     })




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
            // Train.insertMany(results).then(res => {
            //     console.log(res.data)
            // }).catch(e => {
            //     console.log(e)
            // })
            console.log("data insertion ended");
        });
});

app.get("/", async (req, res) => {
    let trains = await Train.find()
    res.send({ some: trains })
});



app.get('/trains', async (req, res) => {
    let trains = await Train.find()
    // var json = trains.
    res.send(trains)
})

// app.post('/trains', async (req, res) => {

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

// const express = require("express");
// const multer = require("multer");
// const csv = require("csv-parser");
// const fs = require("fs");
// const mongoose = require("mongoose");

// const app = express();

// mongoose.connect("mongodb://localhost/mydatabase", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const schema = new mongoose.Schema({
//   name: String,
//   email: String,
// });

// const User = mongoose.model("User", schema);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/upload", upload.single("file"), (req, res) => {
//   const results = [];

//   fs.createReadStream(req.file.path)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", () => {
//       User.insertMany(results, (err, docs) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send("Error uploading file");
//         } else {
//           console.log(docs);
//           res.send("File uploaded successfully");
//         }
//       });
//     });
// });