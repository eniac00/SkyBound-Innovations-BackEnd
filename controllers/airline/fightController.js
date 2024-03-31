const AirlineDetails = require('../../model/AirlineDetails');
const User = require('../../model/User');
const Package = require('../../model/Package');
const Flight = require('../../model/flights');


const createFlight = async (req, res) => {
 const { flightName, from, to, amount,time } = req.body;

 if (!flightName || !from || !to || !amount || !time) 
     return res.status(400).json({ 'message': 'some info are missing' });

 try {
     const airline = await User.findOne({ username: req.username }).exec();
     const airlineDetails = await AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();
     const newFlight = await Flight.create({
         "airline_username": req.username,
         "flightName": flightName,
         "from": from,
         "to": to,
         "amount": amount,
         "time": time
     })

     airlineDetails.flights.push(newFlight._id);
     const result = await airlineDetails.save();
     res.status(200).json({ 'message': `flight name ${flightName} added` });
 } catch (err) {
     res.status(500).json({ 'message': err.message });
 }
}

module.exports = {
 createFlight 
}