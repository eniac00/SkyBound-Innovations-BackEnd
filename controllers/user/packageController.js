const Package = require('../../model/Package');

const getAllPackages = async (req, res) => {
    const packages = await  Package.find({})
    res.status(200).json(packages);
}

const getSinglePackage = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'Package ID required' });
    const SinglePackage = await Package.findOne({ _id: req.params.id }).exec();
    if (!SinglePackage) {
        return res.status(204).json({ 'message': `Package ID ${req.params.id} not found` });
    }
    res.json(SinglePackage);
  }

module.exports = {
    getAllPackages,
    getSinglePackage
}