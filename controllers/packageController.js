
const package = require('../model/Package')



const newPackage = async (req, res) => {
    if (!req?.body?.destination || !req?.body?.No_of_days || !req?.body?.price) {
        return res.status(400).json({ 'message': 'Give all necessary data' });
    }

    try {
        const result = await package.create({
            destination: req.body.destination,
            No_of_days: req.body.No_of_days,
            price: req.price
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    newPackage
}