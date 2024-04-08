const Flight = require('../../model/Flight')
const AirlineDetails = require('../../model/AirlineDetails');

const getFlights = async (req, res) => {
 const { airlineName,from,to } = req.body;


 try {
     
     console.log("airline",airlineName)
     console.log("FROM",from)
     console.log("TO",to)
     const airline = await AirlineDetails.findOne({ name: airlineName }).exec();
     
     if (!airline) {
         return res.status(404).json({ message: 'Airline not found' });
     }
     const result = await Flight.find({ airline_username: airline.name,from:from,to:to }).exec();
     
     res.json(result);
 } catch (error) {
     console.error('Error fetching flights:', error);
     res.status(500).json({ message: 'Internal server error' });
 }
}

module.exports = {
 getFlights
}

