const User = require('../../model/User');
const UserDetails = require('../../model/UserDetails');
const bcrypt = require('bcrypt');
const ROLES_LIST = require('../../config/roles_list');

const getAllUsers = async (req, res) => {
     const result = await User.aggregate([
        {
          $match: {
            'roles.User': ROLES_LIST.User
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

    
    if (!result) return res.status(204).json({ 'message': 'No users found' });
    res.json(result);
}

const createNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const details = await UserDetails.create({ 
            "firstname": req.body.firstname,
            "lastname": req.body.lastname
        });

        const result = await User.create({
            "username": username,
            "password": hashedPwd,
            "detailsObjectId": details._id
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }

    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ "message": `No users matches ID ${req.body.id}.` });
    }

    const userDetails = await UserDetails.findOne({ _id: user.detailsObjectId }).exec();

    if (req.body?.username) user.username = req.body.username;
    if (req.body?.password) user.password = req.body.password;
    if (req.body?.firstname) userDetails.firstname = req.body.firstname;
    if (req.body?.lastname) userDetails.lastname = req.body.lastname;
    const result = await user.save();
    const resultDetails = await userDetails.save();
    res.json(result);
}



const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const userDetails = await UserDetails.findOne({ _id: user.detailsObjectId }).exec();
    const resultDetails = await userDetails.deleteOne({ _id: userDetails._id });
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}