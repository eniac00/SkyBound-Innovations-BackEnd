const User = require('../model/User');
const UserDetails = require('../model/UserDetails');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) return res.status(400).json({ 'message': 'username and password and email are required.' });

    // check for duplicate usernamenames in the db
    const duplicate = await User.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedpassword = await bcrypt.hash(password, 10);

        const details = await UserDetails.create({ 
            "firstname": req?.body?.firstname,
            "lastname": req?.body?.lastname
        });


        //create and store the new username
        const result = await User.create({
            "username": username,
            "password": hashedpassword,
            "email": email,
            "detailsObjectId": details._id
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };