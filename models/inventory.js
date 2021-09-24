const mongoose = require('mongoose')

const invSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
})

const Inventory = mongoose.model('Inventory', invSchema)

module.exports = Inventory