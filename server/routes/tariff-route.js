var express = require('express');
var router = express.Router();

var tariff = require('../models/tariff.js');


// add-tariff Post Method Route----------------------------------------------->

router.post('/', function (req, res) {
    console.log(req.body);
    var NewTariff = new tariff({
        cabType: req.body.cabType,
        normalRate: req.body.normalRate,
        peakRate: req.body.peakRate,
        startPeakTime: req.body.startPeakTime,
        endPeakTime: req.body.endPeakTime,
        baseFare: req.body.baseFare
    });
    NewTariff.save(function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('New Tariff Added Successfully');
            res.end();
        }
    });
});

module.exports = router;    