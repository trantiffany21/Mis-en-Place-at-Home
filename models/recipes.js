const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cuisine: [{type: String}],
    servingSize: {type: Number},
    ingredientList: [{
        ingredient: {type: String},
        measurement: {type: String},
        measurementType:{type: String},
    }], 
    img: {type: String},
    urlLink: {type: String}, 
    youtubeLink: {type: String},
    directions: [{type:String}],
    notes: {type: String},
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe