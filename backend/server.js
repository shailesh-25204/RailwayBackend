const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Train = require('./models/train');
const trainsRouter = require('./routes/trains')
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/train-details'
// mongodb+srv://hemantb2002:HMqz6jrDXpxvByJs@cluster24.apmyl1t.mongodb.net/?retryWrites=true&w=majority
// mongodb://localhost:27017

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.once('open', () => console.log('Connected to Database'))

app.use(bodyParser.json());
app.use('/trains', trainsRouter)
app.use(express.json());
app.use(cors())

app.get("/", async (req, res) => {
    let trains = await Train.find()
    res.send({ some: trains })
});

// app.get("/", async (req, res) => {
//     let train = undefined
//     try {
//         train = await Train.find()
//         if (train == null) {
//             res.send(res.status())
//             // return res.status(404).json({ message: 'Cannot find' })
//         }
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// });

// app.get('/trains', (req, res) => {
//     res.send({ three: 'json' })
// })

app.get('/trains', async (req, res) => {
    let trains = await Train.find()
    // var json = trains.
    res.send(trains)
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});