const Payment = require('../../model/Payment');


const getHistory = async (req, res) => {
    try {
        const result = await Payment.aggregate([
            // Match payments based on username and purpose
            {
              $match: { username: req.username, purpose: "package_booking" }
            },
            // Convert flight_id to ObjectId type
            {
              $addFields: {
                flight_id: { $toObjectId: "$flight_id" }
              }
            },
            // Lookup flight schemas based on flight_id
            {
              $lookup: {
                from: "flightschemas", // Collection name
                localField: "flight_id",
                foreignField: "_id",
                as: "flightInfo"
              }
            }
          ]);

          res.status(200).json(result);
    } catch(err) {
        console.log(err);
        res.sendStatus(503);
    }
}


module.exports = {
    getHistory
}