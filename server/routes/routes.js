var express = require('express');
var router = express.Router();
var user = require('./server/models/user');

router.post('/sign-up', function (req, res) {
    console.log(req.body);
    var NewUser = new user({
        role: 'User',
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password
    });
    NewUser.save(function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('New User Added Successfully');
            res.end();
        }
    });
});

router.post('/add-driver', function (req, res) {
    console.log(req.body);
    var NewUser = new user({
        role: 'Driver',
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        licenseNo: req.body.licenseNo,
        licenseExp: req.body.licenseExp,
        experience: req.body.experience,
        cabNo: req.body.cabNo,
        cabType: req.body.cabType,
        model: req.body.model,
        color: req.body.color
    });
    NewUser.save(function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('New Driver Added Successfully');
            res.end();
        }
    });
});

module.exports = router;    