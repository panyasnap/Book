const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
    },
    displayName: {
        type: String,
        default: "",
    },
    emails: {
        type: String,
        default: "",
    }
})

module.exports = model('User', userSchema)