var jwt = require('jsonwebtoken');
var verifyToken = function (req, res, next) {
    console.log(req.body.token);
    console.log(req.query.token);
    console.log(req.headers['x-access-token']);


    // var token = req.headers['x-access-token'];
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'mysecret', function (err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        // if everything good, save to request for use in other routes
        console.log('access granted');
        next();
    });
}

module.exports = verifyToken;