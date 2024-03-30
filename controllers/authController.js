const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    console.log('TEST',req.body);
    if (!username || !password) return res.status(400).json({ 'message': 'username and password are required.' });

    const founduser = await User.findOne({ username: username }).exec();
    if (!founduser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, founduser.password);
    if (match) {
        console.log('HOISE')
        const roles = Object.values(founduser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": founduser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        const refreshToken = jwt.sign(
            { "username": founduser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current username
        founduser.refreshToken = refreshToken;
        const result = await founduser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        // Send authorization roles and access token to username
        res.json({ roles, accessToken, detailsObjectId: founduser.detailsObjectId });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };