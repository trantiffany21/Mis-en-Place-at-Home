const mongoose = require('mongoose')

const invSchema = new mongoose.Schema({
    invIngredient: {
        type: String,
        required: true,
        unique: true
    },
    category: {type: String},
}, {timestamps: true})

const Inventory = mongoose.model('Inventory', invSchema)

module.exports = Inventory