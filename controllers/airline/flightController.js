const AirlineDetails = require('../../model/AirlineDetails');
const User = require('../../model/User');
const Package = require('../../model/Package');
const Flight = require('../../model/Flight');



const getFlights = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createFlight = async (req, res) => {
 const { flightName,from, to, price, time,packageId} = req.body;
 console.log('flightName',flightName,'from',from,'to',to,'price',price,'time',time,packageId)
 if (!flightName || !from || !to || !price || !time||!packageId) 
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
         "time": time,
         "packageId":packageId
     })

     airlineDetails.flights.push(newFlight._id);
     const result = await airlineDetails.save();
     res.status(200).json({ 'message': `Flight name ${flightName} added` });
 } catch (err) {
  
     res.status(500).json({ 'SAM message': err.message });
 }
}


module.exports = {
 createFlight,
 getFlights
 
}