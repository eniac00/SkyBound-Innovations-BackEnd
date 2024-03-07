
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
            image:req.body.image
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}


module.exports = {
    newPackage
}