const express = require('express')
const Recipe = require('../models/recipes')
const Inventory = require('../models/inventory')
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

router.get('/new', (req,res)=>{
    res.render('newRecipe.ejs')
})

//match router
router.get('/match', async (req,res)=>{
    // try{
    //     Recipe.find({}, "ingredientList.ingredient", (err,ingredients)=>{
    //         let arrayOfIngredientList = []
    //         let objRecipes = {}
    //         let arrIngredients = []
    //         for(let recipeIndex in ingredients){
    //             let individualRecipe = ingredients[recipeIndex]
    //             arrIngredients = []
    //             objRecipes = {}
    //             objRecipes.recipeId = individualRecipe.id
    //             for(let ingredientIndex in individualRecipe.ingredientList){
    //                 arrIngredients.push(individualRecipe.ingredientList[ingredientIndex].ingredient)
    //             }
    //             objRecipes.arrIngredients = arrIngredients
    //             arrayOfIngredientList.push(objRecipes)
    //         }
    //         //res.send(arrayOfIngredientList)

    //         let matchIds = []
    //         for(let i = 0; i< arrayOfIngredientList.length; i++){
    //             console.log("test: " , arrayOfIngredientList[i]['arrIngredients'])
    //             let normIng = arrayOfIngredientList[i]['arrIngredients'].map( item =>{
    //                 return new RegExp(item, "i")
    //             })
    //             console.log('norm ', normIng)
    //             Inventory.find({
    //                  invIngredient: {$in: normIng}}, 'id invIngredient', (err, found)=>{
    //                      let length = Object.keys(found).length
    //                      if(length = normIng.length){
    //                          matchIds.push( arrayOfIngredientList[i]['recipeId'])
    //                          res.send(matchIds)
    //                         }
    //                     })
                
    //             }
 
    //     })
    // }catch(err){
    //     console.log(err.message)
    // }

        let ingredients = await Recipe.find({}, "ingredientList.ingredient")
        console.log('ingredients: ', ingredients)
        let arrayOfIngredientList = []
        let objRecipes = {}
        let arrIngredients = []
        let recipeMatchIds = []
        for(let recipeIndex in ingredients){
            let individualRecipe = ingredients[recipeIndex]
            arrIngredients = []
            objRecipes = {}
            objRecipes.recipeId = individualRecipe.id
            for(let ingredientIndex in individualRecipe.ingredientList){
                arrIngredients.push(individualRecipe.ingredientList[ingredientIndex].ingredient)
            }
            objRecipes.arrIngredients = arrIngredients
            arrayOfIngredientList.push(objRecipes)
            //res.send(arrayOfIngredientList)
        
            console.log("array of ingredientList" , arrayOfIngredientList)
        }
        for(let i = 0; i< arrayOfIngredientList.length; i++){
            console.log("ingredientList: " , arrayOfIngredientList[i]['arrIngredients'])
            let normIng = arrayOfIngredientList[i]['arrIngredients'].map( item =>{
                return new RegExp(item, "i")
            })
            console.log('norm ', normIng)
            let match = await Inventory.find({
                invIngredient: {$in: normIng}}, 'id invIngredient')
            console.log('match, ', match)
            if(match.length === normIng.length){
                recipeMatchIds.push( arrayOfIngredientList[i]['recipeId'])
            }
            
            }
        console.log('recipematchids: ', recipeMatchIds)
        let foundMatches = await Recipe.find({_id: {$in: recipeMatchIds}})
        //res.send(foundMatches)
        res.render('match.ejs', {recipes: foundMatches})
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

router.post('/', (req,res)=>{
    try{
        let ingredientList = []
        //arrays from req.body
        let ingredients = req.body.ingredient
        let measurements = req.body.measurement
        let measurementTypes = req.body.measurementType

        //iterate through array to create new objects and push to array
        for(let i = 0; i<ingredients.length; i++){
            let obj = {}
            obj.ingredient = ingredients[i]
            obj.measurement = measurements[i]
            obj.measurementType = measurementTypes[i]
            ingredientList.push(obj)
        }
        //assign new array of objects to req.body.ingredientList
        req.body.ingredientList = ingredientList
        console.log(req.body)
        Recipe.create(req.body, (err, newRecipe)=>{
            if(err){
                console.log(err)
            }else{
                res.redirect(`/recipes`)
            }
        })
    }catch(err){
        console.log(err.message)
    }
})

router.put('/:id', (req,res)=>{
    try{
        let ingredientList = []
        //arrays from req.body
        let ingredients = req.body.ingredient
        let measurements = req.body.measurement
        let measurementTypes = req.body.measurementType

        //iterate through array to create new objects and push to array
        for(let i = 0; i<ingredients.length; i++){
            let obj = {}
            obj.ingredient = ingredients[i]
            obj.measurement = measurements[i]
            obj.measurementType = measurementTypes[i]
            ingredientList.push(obj)
        }

        //assign new array of objects to req.body.ingredientList
        req.body.ingredientList = ingredientList
        console.log(req.body)
        Recipe.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedRecipe)=>{
            if(err){
                console.log(err)
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