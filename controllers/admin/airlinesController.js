const User = require('../../model/User');
const AirlineDetails = require('../../model/AirlineDetails');
const bcrypt = require('bcrypt');
const ROLES_LIST = require('../../config/roles_list');

const getAllAirlines = async (req, res) => {
     const result = await User.aggregate([
        {
          $match: {
            'roles.User': ROLES_LIST.Airline
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

    
    if (!result) return res.status(204).json({ 'message': 'No airlines found' });
    res.json(result);
}

const createNewAirline = async (req, res) => {
    const { username, password, email} = req.body;
    if (!username || !password || !email) return res.status(400).json({ 'message': 'Username password email are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const details = await AirlineDetails.create({ 
            "name": req.body.name,
            "license": req.body.license,
            "registration": req.body.registration
        });

        const result = await User.create({
            "username": username,
            "password": hashedPwd,
            "email": email,
            "roles": { "User": ROLES_LIST.Airline },
            "detailsObjectId": details._id
        });


        console.log(result);

        res.status(201).json({ 'success': `New airline ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const updateAirline = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const airline = await User.findOne({ _id: req.body.id }).exec();
    if (!airline) {
        return res.status(204).json({ "message": `No airlines matches ID ${req.body.id}.` });
    }
    const airlineDetails = await  AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();
    if (req.body?.username) airline.username = req.body.username;
    if (req.body?.password) airline.password = req.body.password;
    if (req.body?.name) airlineDetails.name = req.body.name;
    if (req.body?.license) airlineDetails.license = req.body.license;
    if (req.body?.registration) airlineDetails.registration = req.body.registration;
    const result = await airline.save();
    const resultDetails = await airlineDetails.save();
    res.json(result);
}



const deleteAirline = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const airline = await User.findOne({ _id: req.body.id }).exec();
    if (!airline) {
        return res.status(204).json({ 'message': `airline ID ${req.body.id} not found` });
    }
    const airlineDetails = await AirlineDetails.findOne({ _id: airline.detailsObjectId }).exec();
    const resultDetails = await airlineDetails.deleteOne({ _id: airlineDetails._id });
    const result = await airline.deleteOne({ _id: req.body.id });
    res.json(result);
}

module.exports = {
    getAllAirlines,
    createNewAirline,
    updateAirline,
    deleteAirline
}