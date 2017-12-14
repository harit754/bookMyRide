var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var bcrypt = require('bcrypt');

// Sign-up Post-Method Route---------------------------------------------->

router.post('/sign-up', function (req, res) {
    console.log(req.body);

    bcrypt.hash(req.body.password, 5, function (err, hashPassword) {
        if (err) {
            throw err;
        } else {
            var NewUser = new user({
                role: 'User',
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hashPassword
            });

            // Store hash in your password DB.
            NewUser.save(function (err, data) {
                if (err) {
                    throw err;
                } else {
                    console.log('New User Added Successfully');
                    res.end();
                }
            });
        }
    });
});

// Login Post-Method Route---------------------------------------------->

router.post('/login', function (req, res) {
    user.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        var token = jwt.sign({ email: user.email }, 'mysecret', {
            expiresIn: 3600 // expires in 1 hour
        });
        res.status(200).send({ auth: true, token: token });
    });
});

// Logout Get-Method Route---------------------------------------------->

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});


// Add-Driver Post method Route---------------------------------------------->

router.post('/add-driver', function (req, res) {
    console.log(req.body);
    bcrypt.hash(req.body.password, 5, function (err, hashPassword) {
        if (err) {
            throw err;
        } else {
            var NewUser = new user({
                role: 'Driver',
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                password: hashPassword,
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
        }
    });

});


module.exports = router;    