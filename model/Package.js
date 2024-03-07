const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
    Destination: {
        type: String,
        required: true
    },
    No_of_days: {
        type: Number, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    HOTELS: {
        type: [String], 
        default: [] 
    }
});

module.exports = mongoose.model('Package', flightSchema); 