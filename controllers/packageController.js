
const package = require('../model/Package')



const newPackage = async (req, res) => {
    if (!req.body.Destination || !req.body.No_of_days || !req.body.price) {
        return res.status(400).json({ 'message': 'Give all necessary data' });
    }
    

    try {
        const result = await package.create({
            Destination: req.body.Destination,
            No_of_days: req.body.No_of_days,
            price: req.body.price,
            image:req.body.image,
            Airlines:req.body.Airlines
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const getAllPackages = async (req, res) => {
    const packages = await package.find();
    if (!packages) return res.status(204).json({ 'message': 'No packages found.' });
    res.json(packages);
}


module.exports = {
    newPackage,
    getAllPackages
}