const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const airlineDetailsSchema = new Schema({
    name: String,
    license: String,
    registration: String,
    flights: [{
        type: Schema.Types.ObjectId,
        ref: 'flights'
    }],
    packages: [{
        type: Schema.Types.ObjectId,
        ref: 'packages'
    }]
});

module.exports = mongoose.model('airlineDetails', airlineDetailsSchema);