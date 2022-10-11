const {Schema, model} = require('mongoose')

const msgSchema = new Schema({
    username: {
        type: String,
        default: "",
    },
    text: {
        type: String,
        default: "",
    },
    book_id: {
        type: String,
        default: "",
    },
})

module.exports = model('Msg', msgSchema)