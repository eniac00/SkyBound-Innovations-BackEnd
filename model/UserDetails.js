const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
    firstname: String,
    lastname: String,
    phoneNumber: String
});

module.exports = mongoose.model('UserDetails', userDetailsSchema);