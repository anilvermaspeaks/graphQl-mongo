const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [{
        type: Schema.Types.ObjectId,
        ref: 'EVENT'
    }]
})

module.exports = mongoose.model('USER', userSchema)