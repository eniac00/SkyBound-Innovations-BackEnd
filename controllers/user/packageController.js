const Package = require('../../model/Package');

const getAllPackages = async (req, res) => {
    const packages = await  Package.find({})
    res.status(200).json(packages);
}

module.exports = {
    getAllPackages
}