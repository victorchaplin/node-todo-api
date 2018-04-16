const mongoose = require('mongoose'),
    validator = require('validator'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    const user = this
    const access = 'auth'
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

    user.tokens.push({access, token})

    return user.save().then(() => {
        return token
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = User

// validator: validator.isEmail
// é o mesmo que
// validator: (value) => {
//     return validator.isEmail(value)
// }