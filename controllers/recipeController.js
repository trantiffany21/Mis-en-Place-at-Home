const express = require('express')
const Recipe = require('../models/recipes')
const recipeSeed = require('../models/seed/recipeSeed')
const router = express.Router()

router.get('/', (req,res)=>{
    try{
        Recipe.find({}, (err, allRecipes)=>{
            err ? console.log(err) : res.render('indexRecipe.ejs', {recipes: allRecipes})
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

router.get('/:id/edit', (req,res)=>{
    try{
        Recipe.findById(req.params.id, (err, foundRecipe)=>{
            err ? console.log(err) : res.render('editRecipe.ejs', {recipe: foundRecipe, ingredientList: foundRecipe.ingredientList})
        })
        
    }catch(err){
        console.log(err.message)
    }
})
router.get('/:id', (req,res)=>{
    try{
        Recipe.findById(req.params.id, (err, foundRecipe)=>{
            err ? console.log(err) : res.render('showRecipe.ejs', {recipe: foundRecipe})
            // console.log(foundRecipe)
        })
        
    }catch(err){
        console.log(err.message)
    }
})

router.put('/:id', (req,res)=>{
    try{
        let ingredientList = []
                let ingredients = req.body.ingredient
                let measurements = req.body.measurement
                let measurementTypes = req.body.measurementType
                for(let i = 0; i<ingredients.length; i++){
                    let obj = {}
                    obj.ingredient = ingredients[i]
                    obj.measurement = measurements[i]
                    obj.measurementType = measurementTypes[i]
                    ingredientList.push(obj)
                }
                req.body.ingredientList = ingredientList
                console.log(req.body)
        Recipe.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedRecipe)=>{
            if(err){
                console.log(err)
                res.redirect(`/recipes/${req.params.id}/edit`)
            }else{
                
                res.redirect(`/recipes/${req.params.id}`)
            }
        })
    }catch(err){
        console.log(err.message)
    }
})

router.delete('/:id', (req,res)=>{
    try{
        Recipe.findByIdAndDelete(req.params.id, (err, deletedRecipe)=>{
            err ? console.log(err) : res.redirect('/recipes')
        })
        
    }catch(err){
        console.log(err.message)
    }
})

module.exports  = router