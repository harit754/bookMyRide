var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var userRoute = require('./server/routes/user-route');
var tariffRoute = require('./server/routes/tariff-route');
var verifyToken = require('./server/routes/verify-token');


var bodyParser = require('body-parser');

var app = express();
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '/client')));

app.use('/user', userRoute);

app.use('/tariff', verifyToken, tariffRoute);

mongoose.connect('mongodb://127.0.0.1/Cab-db', { useMongoClient: true }, function (err) {
    if (err) {
        console.log('not connected to data base');
    }
    else {
        console.log('Successfully Connected to database');
    }
});

app.listen(3000, () => {
    console.log('Server started on Port 3000 "http://localhost:3000');
})