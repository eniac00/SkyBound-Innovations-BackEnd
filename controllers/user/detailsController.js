const User = require('../../model/User');
const UserDetails = require('../../model/UserDetails');
const ROLES_LIST = require('../../config/roles_list');

const getDetails = async (req, res) => {
    const result = await User.aggregate([
        {
          $match: {
            username: req.body.username
          }
        },
        {
          $lookup: {
            from: "userdetails", 
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