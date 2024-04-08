const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
    airline_username: {
        type: String,
        required: true
    },
    flightName: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    time: {
        type: String, 
        required: true
    },
    to: {
        type: String, 
        required: true
    },
    price: {
        type: String, 
        required:true
    },
    seat: {
        type: Map,
        default: {
            "A1": [], "A2": [], A3: [], A4: [], A5: [],
            B1: [], B2: [], "B3": [], B4: [], B5: []
        }
    }
});

module.exports = mongoose.model('flightSchema', flightSchema);