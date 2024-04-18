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

const updateFlight = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ "message": 'Flight ID required' });

    try {
      const flight = await Flight.findOne({ _id: req.body.id }).exec();

      if (!flight) {
          return res.status(204).json({ 'message': `Flight ID ${req.body.id} not found` });
      }


      if (req.body?.flightName) flight.flightName = req.body.flightName;
      if (req.body?.from) flight.from = req.body.from;
      if (req.body?.time) flight.time = req.body.time;
      if (req.body?.to) flight.to = req.body.to;
      if (req.body?.price) flight.price = req.body.price;
      
      const result = await flight.save();
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(503).json({ 'error': 'update flight failed' });
    }
}


const deleteFlight = async (req, res) => {

  if (!req?.body?.id) return res.status(400).json({ "message": 'Flight ID required' });

  const flight = await Flight.findOne({ _id: req.body.id }).exec();

  if (!flight) {
      return res.status(204).json({ 'message': `flight ID ${req.body.id} not found` });
  }

  const airline = await User.findOne({ username: req.username }).exec();
  const airlineDetails = await AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();

  await AirlineDetails.updateOne({ _id: airlineDetails._id }, { $pull: { packages: req.body.id } });
  await Flight.deleteOne({ _id: req.body.id });

  res.status(200).json({ "message": `Flight ${req.body.id} removed`});
}


module.exports = {
 createFlight,
 getFlights,
 deleteFlight,
 updateFlight
}