var express = require('express');
var router = express.Router();
var user = require('../models/user.js');
var bcrypt = require('bcrypt');
var verifyToken = require('./verify');
var jwt = require('jsonwebtoken');

// Sign-up GET-USER-Method Route---------------------------------------------->
router.get('/get-user/:email', function (req, res) {
    user.findOne({ email: req.body.email }, function (err, user) {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    });
});

// Change-Password Method------------------------------------------------->
router.put('/change-password/:email', function (req, res) {
    console.log('CHange PAsssword');
    console.log(req.body);

    user.findOne({ email: req.params.email }, function (err, userData) {
        if (err) return res.status(500).send('Error on the server.');
        if (!userData) return res.status(404).send('No user found.');
        var passwordIsValid = bcrypt.compareSync(req.body.oldPassword, userData.password);
        if (!passwordIsValid) return res.send('Old password did not match.');
        if (passwordIsValid) {
            bcrypt.hash(req.body.newPassword, 5, function (err, hashPassword) {
                if (err) {
                    throw err;
                } else {
                    user.findOneAndUpdate({ email: req.params.email }, {
                        password: hashPassword,
                    }, function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('New Password Updated Successfully');
                            res.status(200).send('New Password Updated Successfully !');
                        }
                    });
                }
            });
        }
    });

});


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
        res.status(200).send({ auth: true, token: token, user: user });
    });
});

// Login Get-Method Route---------------------------------------------->

// router.get('/me', function (req, res) {
//     var token = req.headers['x-access-token'];
//     if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//     jwt.verify(token, config.secret, function (err, decoded) {
//         if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

//         res.status(200).send(decoded);
//     });
// });


// Logout Get-Method Route---------------------------------------------->

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});


// Add-Driver Post method Route---------------------------------------------->

router.post('/add-driver', verifyToken, function (req, res) {
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

router.get('/driver', function (req, res) {
    user.find({}, function (err, data) {
        if (err) {
            throw err;
        } else {
            res.json(data);
        }
    });
});

router.delete('/driver/:id', function (req, res) {
    user.remove({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('Driver Removed Successfully');
            res.end();
        }
    });
});

router.put('/driver/:id', function (req, res) {
    user.findOneAndUpdate({ _id: req.params.id }, {
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
    }, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.log('Driver Updated Successfully');
            res.end();
        }
    }
    );
});

module.exports = router;    