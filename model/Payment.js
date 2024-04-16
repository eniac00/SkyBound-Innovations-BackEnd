const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  username: String,
  purpose: String,
  package_name: String,
  airline_name: String,
  flight_id: String,
  seats: String,
  price: Number,
  status: {
    type: String,
    default: 'pending'
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;