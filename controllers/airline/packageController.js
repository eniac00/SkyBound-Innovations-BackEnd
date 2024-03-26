const AirlineDetails = require('../../model/AirlineDetails');
const User = require('../../model/User');
const Package = require('../../model/Package');
const ROLES_LIST = require('../../config/roles_list');

const getPackages = async (req, res) => {
        const airline = await User.findOne({ username: req.username }).exec();
        const result = await AirlineDetails.aggregate([
        {
          $match: {
            _id: airline.detailsObjectId
          }
        },
        {
          $lookup: {
            from: "packages", 
            localField: "packages",
            foreignField: "_id",
            as: "packages"
          }
        }
      ]);

    res.json(result);
}

const createPackage = async (req, res) => {
    const { packagename, destination, no_of_days, price, hotel, image } = req.body;

    if (!packagename || !destination || !no_of_days || !price || !hotel || !image) 
        return res.status(400).json({ 'message': 'some info are missing' });

    try {
        const airline = await User.findOne({ username: req.username }).exec();
        const airlineDetails = await AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();
        const newPackage = await Package.create({
            "airline_username": req.username,
            "packagename": packagename,
            "destination": destination,
            "no_of_days": no_of_days,
            "price": price,
            "hotel": hotel,
            "image": image
        })

        airlineDetails.packages.push(newPackage._id);
        const result = await airlineDetails.save();
        res.status(200).json({ 'message': `package name ${packagename} added` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const updatePackage = async (req, res) => {
    // update package
}

const deletePackage = async (req, res) => {
    // delete package
}


module.exports = {
    getPackages,
    createPackage,
    updatePackage,
    deletePackage
}