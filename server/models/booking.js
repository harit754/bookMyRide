var mongoose = require('mongoose');
var BookingSchema = mongoose.Schema({
    cabType: String,
    normalRate: String,
    peakRate: String,
    startPeakTime: String,
    endPeakTime: String,
    baseFare: String
});

module.exports = mongoose.model('booking', BookingSchema);