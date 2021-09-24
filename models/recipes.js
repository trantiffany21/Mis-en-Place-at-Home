const mongoose = require('mongoose')

//subdocument of ingredient list
const ingredientsSchema = new mongoose.Schema({
    ingredient: String, 
    measurement: Number,
    measurementType: String,
})

//subdocument of directions
const directionsSchema = new mongoose.Schema({
    step: Number, 
    direction: String
})

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cuisine: [{type: String}],
    servingSize: {type: Number},
    ingredientList: [ingredientsSchema], 
    urlLink: {type: String}, 
    youtubeLink: {type: String},
    directions: [directionsSchema],
    notes: {type: String},
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe