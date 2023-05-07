require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const Booking = require('./models/bookings')


const app = express();

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
exports.trainsCollection = db.collection('trains')
db.once('open', () => console.log('Connected to Database'))


app.use(bodyParser.json());
app.use(express.json());
app.use(cors())
app.use('/api/train', require('./routes/trains'))//Working 
app.use("/api/admin", require('./routes/admin')); //Working 
app.use('/api/booking', require('./routes/booking'))
app.use('/api/train', require('./routes/trains'))
app.use('/api/auth-user', require('./routes/auth-user'))//Working 


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});



