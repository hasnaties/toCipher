const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error('Email is wrong.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Cannot accept the password as password.')
            }
            else if (!validator.isLength(value, {min: 7, max:64})) {
                throw new Error('Password length is short!')
            }
        }
    },
    permissionLevel: {
        type: Number,
        required: true,
        validate(value){
            if (value>=3 || value<0) {
                throw new Error('Enter valid permission-level.')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
}
);

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject._id;
    delete userObject.__v;
    delete userObject.tokens;
    delete userObject.createdAt;
    delete userObject.updatedAt;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to find.')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login.')
    }

    return user;

}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this

    next()
})

const User = mongoose.model('users', userSchema);

module.exports = User;