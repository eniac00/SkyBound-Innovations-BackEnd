const User = require('../../model/User');
const AirlineDetails = require('../../model/AirlineDetails');
const ROLES_LIST = require('../../config/roles_list');

const getDetails = async (req, res) => {
    const result = await User.aggregate([
        {
          $match: {
            username: req.username
          }
        },
        {
          $lookup: {
            from: "airlinedetails", 
            localField: "detailsObjectId",
            foreignField: "_id",
            as: "details"
          }
        }
      ]);

    
    res.json(result);
}

const updateDetails = async (req, res) => {
    res.status(200).json({ "message": "all good"});
}


module.exports = {
    getDetails,
    updateDetails
}