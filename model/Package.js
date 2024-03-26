const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({
    airline_username: {
        type: String,
        required: true
    },
    packagename: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    no_of_days: {
        type: String, 
        required: true
    },
    price: {
        type: String, 
        required: true
    },
    hotel: {
        type: [String], 
        default: []
    },
    image: {
        type: String,
        default: null // or use an empty string
    },
});

module.exports = mongoose.model('Package', packageSchema);