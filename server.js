var express = require('express');
var path = require('path');
var logger = require('morgan');

var app = express();
app.use(logger('dev'));

app.use('/', express.static(path.join(__dirname, '/client')));

app.listen(3000, () => {
    console.log('Server started on Port 3000 "http://localhost:3000');
})