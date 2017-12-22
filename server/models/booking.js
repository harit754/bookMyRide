var mongoose = require('mongoose');
var BookingSchema = mongoose.Schema({
    role: String,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    cabType: String,
    pickupLocation: String,
    destination: String,
    fare: String,
    time: String,
    date: String
});

module.exports = mongoose.model('booking', BookingSchema);