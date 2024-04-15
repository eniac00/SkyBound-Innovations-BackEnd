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


const updateSeats = async (req, res) => {
 if (!req.body.flightId || !req.body.selectedSeats || !req.body.username) {
     return res.status(400).json({ message: 'flightId, selectedSeats, and username are required.' });
 }

 const { flightId, selectedSeats, username } = req.body;

 try {
     const flight = await Flight.findById(flightId);
     if (!flight) {
         return res.status(404).json({ message: 'Flight not found.' });
     }

     // Update the seats in the flight document and associate the username
     selectedSeats.forEach(seat => {
      // console.log('TEST1 ', flight.seat);
      if (flight.seat.get(seat)) {
          console.log('TEST ', seat);
          flight.seat.get(seat).push(username);
      }
  });

     // Save the updated flight document
     await flight.save();

     res.json({ message: 'Seats updated successfully.' });
 } catch (error) {
     console.error('Error updating flight:', error);
     res.status(500).json({ message: 'Error updating flight.' });
 }
};




module.exports = {
 getFlights,
 updateSeats
}

