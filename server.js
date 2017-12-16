var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');
var userRoute = require('./server/routes/user-route');
var tariffRoute = require('./server/routes/tariff-route');
var verifyToken = require('./server/routes/verify');


var bodyParser = require('body-parser');

var app = express();
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/node_modules')));

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


var server = require('http').createServer(app);
server.listen(3000, () => {
    console.log('Server started on Port 3000 "http://localhost:3000');
})

var io = require('socket.io')(server);
var allDrivers = [];
var allUsers = [];


io.sockets.on('connection', function (socket) {
    socket.on('user-in', function (user) {
        console.log(user);
        allUsers.push({ id: socket.id, user: user });
        io.emit('re-draw-driver-map', allUsers);
    });
    socket.on('user-position-change', function (user) {
        console.log(user);
        var i;
        for (i = 0; i < allUsers.length; i++) {
            if (allUsers[i].id == socket.id) {
                allUsers[i].user = user;
                io.emit('re-draw-driver-map', allUsers);
            }
        }


        io.emit('re-draw-driver-map', allUsers);
    });
    socket.on('driver-in', function (driver) {
        console.log(driver);
        allDrivers.push({ id: socket.id, driver: driver });
        io.emit('re-draw-user-map', allDrivers);
    });
    socket.on('disconnect', function () {
        var i;
        for (i = 0; i < allUsers.length; i++) {
            if (allUsers[i].id == socket.id) {
                allUsers.splice(i, 1);
                io.emit('re-draw-driver-map', allUsers);
            }
        }
        for (i = 0; i < allDrivers.length; i++) {
            if (allDrivers[i].id == socket.id) {
                allDrivers.splice(i, 1);
                io.emit('re-draw-user-map', allDrivers);
            }
        }
    });
});