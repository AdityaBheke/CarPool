const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.routes.js');
const rideRouter = require('./routes/ride.routes.js');
const { errorHandler } = require('./middlewares/errorhandler.middleware');
const cookieParser = require('cookie-parser');
const bookingRouter = require('./routes/booking.routes.js');
const mapRouter = require('./routes/map.route.js');


require('dotenv').config(); 
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/users', userRouter);
app.use('/api/ride', rideRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/map', mapRouter);

app.use((req,res)=>{
    res.status(404).send('API not found.')
})
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
