const AirlineDetails = require('../../model/AirlineDetails');
const User = require('../../model/User');
const Package = require('../../model/Package');

const getPackages = async (req, res) => {
        console.log('sam',req.username)
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
    console.log('packagename',packagename,'destination',destination,'no_of_days',no_of_days,'price',price,'hotel',hotel,image,'image')
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
    if (!req?.body?.id) return res.status(400).json({ "message": 'Package ID required' });

    try {
      const package = await Package.findOne({ _id: req.body.id }).exec();

      if (!package) {
          return res.status(204).json({ 'message': `Package ID ${req.body.id} not found` });
      }

      if (req.body?.airline_username) package.airline_username = req.body.airline_username;
      if (req.body?.packagename) package.packagename = req.body.packagename;
      if (req.body?.destination) package.destination = req.body.destination;
      if (req.body?.no_of_days) package.no_of_days = req.body.no_of_days;
      if (req.body?.price) package.price = req.body.price;
      if (req.body?.hotel) package.hotel = req.body.hotel;
      if (req.body?.image) package.image = req.body.image;

      const result = await package.save();

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(503).json({ 'error': 'update package failed' });
    }
}

const deletePackage = async (req, res) => {

    if (!req?.body?.id) return res.status(400).json({ "message": 'Package ID required' });

    const package = await Package.findOne({ _id: req.body.id }).exec();

    if (!package) {
        return res.status(204).json({ 'message': `Package ID ${req.body.id} not found` });
    }

    const airline = await User.findOne({ username: req.username }).exec();
    const airlineDetails = await AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();

    await AirlineDetails.updateOne({ _id: airlineDetails._id }, { $pull: { packages: req.body.id } });
    await Package.deleteOne({ _id: req.body.id });

    res.status(200).json({ "message": `Package ${req.body.id} removed`});
}




module.exports = {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage,
}