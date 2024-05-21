const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const { validateFirebaseIdToken } = require('./validation');
const bookingRoutes = require('./routes/booking');
const addressRoutes = require('./routes/address');
const {  logger, captureConsoleMethods } = require('./customLogger');


dotenv.config();

//main app
captureConsoleMethods();
console.log("test logs");
logger.log("info", "test log");

const app = express();
app.use(cors({origin : true}));

app.get('/',validateFirebaseIdToken,(req,res) => {
    return res.status(200).send("hello there");
});

app.use('/api',authRoutes);
app.use('/api',validateFirebaseIdToken,bookingRoutes);
app.use('/api',validateFirebaseIdToken,addressRoutes);

app.get('/api/todos',validateFirebaseIdToken,(req,res) => {
    // console.log(req.headers);
    return res.json({
        todos: [
            {
                title:'task1'
            },
            {
                title:'task2'
            },
            {
                title:'task3'
            }
        ]
    })
});

//exports the apis to firebase cloud functions
exports.app = functions.https.onRequest(app);