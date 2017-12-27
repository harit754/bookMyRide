var express = require('express');
var router = express.Router();

var booking = require('../models/booking.js');

// New Booking Post Method Route----------------------------------------------->

router.post('/', function (req, res) {
    console.log(req.body);
    var NewBooking = new booking({
        role: req.body.role,
        type: req.body.type,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        cabType: req.body.cabType,
        pickupLocation: req.body.pickupLocation,
        destination: req.body.destination,
        fare: req.body.fare,
        time: req.body.time,
        date: req.body.date
    });

    if (req.body.driver) NewBooking.driver = req.body.driver;

    NewBooking.save(function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('New Booking Added Successfully');
            res.end();
        }
    });
});

router.get('/', function (req, res) {
    booking.find({}, function (err, data) {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    });
});

module.exports = router;  
