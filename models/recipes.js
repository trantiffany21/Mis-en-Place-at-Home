const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe