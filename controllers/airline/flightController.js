const AirlineDetails = require('../../model/AirlineDetails');
const User = require('../../model/User');
const Package = require('../../model/Package');
const Flight = require('../../model/Flight');



const getFlights = async (req, res) => {
 const airline = await User.findOne({ username: req.username }).exec();
 const result = await AirlineDetails.aggregate([
 {
   $match: {
     _id: airline.detailsObjectId
   }
 },
 {
   $lookup: {
     from: "flightschemas", 
     localField: "flights",
     foreignField: "_id",
     as: "flights"
   }
 }
]);

res.json(result);
}

const createFlight = async (req, res) => {
 const { flightName,from, to, price, time} = req.body;

 if (!flightName || !from || !to || !price || !time) 
     return res.status(400).json({ 'message': 'some info are missing' });

 try {
     const airline = await User.findOne({ username: req.username }).exec();
     const airlineDetails = await AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();
     const newFlight = await Flight.create({
         "airline_username": req.username,
         "flightName": flightName,
         "from": from,
         "to": to,
         "price": price,
         "time": time
     })

     airlineDetails.flights.push(newFlight._id);
     const result = await airlineDetails.save();
     res.status(200).json({ 'message': `package name ${flightName} added` });
 } catch (err) {
     res.status(500).json({ 'message': err.message });
 }
}


module.exports = {
 createFlight,
 getFlights
 
}