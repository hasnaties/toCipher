const jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error('No user found.')
        }

        req.token = token;
        req.user = user;
        next()

    } catch (error) {
        res.status(401).send({Authentication_failed_error:  error})
    }
}

const isPermission = async (req, next) => {
   
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token})

        if (user.permissionLevel != req.body.permissionLevel && req.body.permissionLevel>user.permissionLevel) {
                return false;
            }
        return true

    } catch (e) {
        throw new Error(e)
    }
}

module.exports = {auth, isPermission}