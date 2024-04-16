const Payment = require('../model/Payment');
const Flight = require('../model/Flight');
const User = require('../model/User');
const SSLCommerzPayment = require('sslcommerz-lts');

const doPayment = async (req, res) => {
    const { username, purpose, package_name, airline_name, price, seats, flight_id } = req.body;
    try {
        const payment = await Payment.create({ username, purpose, package_name, airline_name, price, seats, flight_id });

        if (payment?._id) {
            const data = {
                total_amount: `${price}`,
                currency: 'BDT',
                tran_id: `${payment._id}`, // use unique tran_id for each api call
                success_url: `http://localhost:3001/payment/success/${payment._id}`,
                fail_url: 'http://localhost:3001/payment/fail',
                cancel_url: 'http://localhost:3001/cancel',
                ipn_url: 'http://localhost:3001/ipn',
                shipping_method: 'Courier',
                product_name: `${purpose}`,
                product_category: 'Electronic',
                product_profile: 'general',
                cus_name: `${username}`,
                cus_email: 'customer@example.com',
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
            };

            const sslcz = new SSLCommerzPayment(process.env.STORE_ID, process.env.STORE_SECRET, false);
            sslcz.init(data).then(apiResponse => {
                // Redirect the user to payment gateway
                let GatewayPageURL = apiResponse.GatewayPageURL
                res.status(200).json({ "url": `${GatewayPageURL}` });
            });
        }
    } catch(err) {
        console.log(err);
        res.sendStatus(503);
    }
}

const success = async (req, res) => {
    try {
        const updatedPayment = await Payment.findOneAndUpdate(
          { _id: req.params.tran_id }, // Filter by _id
          { status: 'paid' }, // Update the status field to 'paid'
          { new: true } // Return the updated document
        );

        if (updatedPayment.purpose === 'becoming_premium') {
            const user = await User.findOneAndUpdate(
                { username: updatedPayment.username },
                { type: 'Premium' }, // Update the type to 'premium'
                { new: true } // Return the updated document
              );
        } else {
            const seatKey = `seat.${updatedPayment.seats}`; // Construct the dynamic object key

            const updatedFlight = await Flight.findOneAndUpdate(
                { _id: updatedPayment.flight_id }, // Filter by flightId
                { $push: { [seatKey]: updatedPayment.username } }, // Append username to the array corresponding to seat
                { new: true } // Return the updated document
            );
        }
        res.redirect('http://localhost:5173/success');
    } catch(err) {
        console.log(err);
        res.sendStatus(503);
    }
}

const fail = async (req, res) => {
    res.redirect('http://localhost:5173/fail');
}

module.exports = {
    success,
    fail,
    doPayment
}