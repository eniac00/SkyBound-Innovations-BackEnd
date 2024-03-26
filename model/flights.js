const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flightSchema = new Schema({
    airlineref: {
        type: Schema.Types.ObjectId
    },
    from: String,
    to: String,
    time: String,
    Day: String
});

module.exports = mongoose.model('flightSchema', flightSchema);