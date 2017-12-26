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

router.get('/', function (req, res) {
    tariff.find({}, function (err, data) {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    });
});

router.delete('/:id', function (req, res) {
    tariff.remove({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('Tariff Removed Successfully');
            res.end();
        }
    });
});

router.put('/:id', function (req, res) {
    tariff.findOneAndUpdate({ _id: req.params.id }, {
        cabType: req.body.cabType,
        normalRate: req.body.normalRate,
        peakRate: req.body.peakRate,
        startPeakTime: req.body.startPeakTime,
        endPeakTime: req.body.endPeakTime,
        baseFare: req.body.baseFare
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('Tariff Updated Successfully');
            res.end();
        }
    }
    );
});

module.exports = router; 