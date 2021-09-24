const express = require('express')
const Recipe = require('../models/recipes')
const recipeSeed = require('../models/seed/recipeSeed')
const router = express.Router()

router.get('/', (req,res)=>{
    try{
        Recipe.find({}, (err, allRecipes)=>{
            err ? console.log(err) : res.send(allRecipes)
        })
        
    }catch(err){
        console.log(err.message)
    }
})
router.get('/seed', async (req,res)=>{
    try{
        const recipeSeedData = await Recipe.create(recipeSeed)
        res.redirect('/recipes')
    }catch(err){
        console.log(err.message)
    }
})


module.exports  = router