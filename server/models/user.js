var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    role: String,
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    password: String,
    licenseNo: String,
    licenseExp: String,
    experience: String,
    cabNo: String,
    cabType: String,
    model: String,
    color: String
});

module.exports = mongoose.model('user', UserSchema);
