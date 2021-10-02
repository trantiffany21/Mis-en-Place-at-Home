const express = require('express')
const Recipe = require('../models/recipes')
const Inventory = require('../models/inventory')
const recipeSeed = require('../models/seed/recipeSeed')
const router = express.Router()

router.get('/', (req,res)=>{
    try{
        Recipe.find({}, (err, allRecipes)=>{
            err ? console.log(err) : res.render('indexRecipe.ejs', {recipes: allRecipes, pageTitle: "All Recipes"})
        }).sort({name:1})
        
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
        //find all ingredients names for each recipe, stored as an object with ingredientList being an array of objects
        let ingredients = await Recipe.find({}, "ingredientList.ingredient name")
        console.log('ingredients: ', ingredients)

        //create empty arrays and objects to create the new array of only ingredient names
        let arrayOfIngredientList = []
        let objRecipes = {}
        let arrIngredients = []
        let recipeMatchIds = []

        //iteratre through ingredients object and create a new array of just the ingredient names and recipe ID. arrayOfIngredientList will be an array of every recipe and its ingredients stored as an object
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
        
        }
        console.log("array of ingredientList" , arrayOfIngredientList)

        //iterate through the Inventory and search for the array of ingredients. If the count of matches equals the count of ingredients in the recipe, push the recipe ID into new array recipeMatchIds
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

        //find the matching recipe IDs in the Recipe db and create array to send those items to the indexRecipe.ejs
        let foundMatches = await Recipe.find({_id: {$in: recipeMatchIds}})
        res.render('indexRecipe.ejs', {recipes: foundMatches, pageTitle: "Kitchen-Ready Recipes"})
})

//almost match route
router.get('/approxmatch', async (req,res)=>{
    //find all ingredients names for each recipe, stored as an object with ingredientList being an array of objects
    let ingredients = await Recipe.find({}, "ingredientList.ingredient name")
    console.log('ingredients: ', ingredients)

    //create empty arrays and objects to create the new array of only ingredient names
    let arrayOfIngredientList = []
    let objRecipes = {}
    let arrIngredients = []
    let recipeMatchIds = []
    let notFoundArr = []
    let notFoundObj = {}

    //iteratre through ingredients object and create a new array of just the ingredient names and recipe ID. arrayOfIngredientList will be an array of every recipe and its ingredients stored as an object
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
    
    }
    console.log("array of ingredientList" , arrayOfIngredientList)

    //iterate through the Inventory and search for the array of ingredients. If the count of matches equals the count of ingredients in the recipe, push the recipe ID into new array recipeMatchIds
    for(let i = 0; i< arrayOfIngredientList.length; i++){
        console.log("ingredientList: " , arrayOfIngredientList[i]['arrIngredients'])
        notFoundObj = {}
        notFoundObj.notFoundIng = []
        let normIng = arrayOfIngredientList[i]['arrIngredients'].map( item =>{
            return new RegExp(item, "i")
        })
        console.log('norm ', normIng)
        let match = await Inventory.find({
            invIngredient: {$in: normIng}}, 'id invIngredient')
        console.log('match, ', match)
        for(let j = 0; j< normIng.length; j++){
            let na = await Inventory.find({invIngredient: {$in: normIng[j]}}, 'id invIngredient')
            console.log('na: ', na)
            if(na.length === 0){
                notFoundObj.recipeId = arrayOfIngredientList[i]['recipeId']
                notFoundObj.notFoundIng.push(arrayOfIngredientList[i]['arrIngredients'][j])
            }
        }
        notFoundArr.push(notFoundObj)
        if(match.length+2 >= normIng.length){
            recipeMatchIds.push( arrayOfIngredientList[i]['recipeId'])
        }
        
    }
    console.log('missing: ', notFoundArr)
    console.log('recipematchids: ', recipeMatchIds)

    //find the matching recipe IDs in the Recipe db and create array to send those items to the indexRecipe.ejs
    let foundMatches = await Recipe.find({_id: {$in: recipeMatchIds}})

    res.render('indexRecipe.ejs', {recipes: foundMatches, notFound: notFoundArr, pageTitle: "Kitchen (Almost) Ready Recipes"})
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
        console.log("test: ", typeof ingredients)
        if(ingredients){
            if(typeof ingredients === 'array'){
                for(let i = 0; i<ingredients.length; i++){
                    let obj = {}
                    obj.ingredient = ingredients[i]
                    obj.measurement = measurements[i]
                    obj.measurementType = measurementTypes[i]
                    ingredientList.push(obj)
                }
            }else if(typeof ingredients === 'string'){
                let obj = {}
                obj.ingredient = ingredients
                    obj.measurement = measurements
                    obj.measurementType = measurementTypes
                    ingredientList.push(obj)
            }
        }
        //assign new array of objects to req.body.ingredientList
        req.body.ingredientList = ingredientList

        for(let i = 0; i< req.body.directions.length; i++ ){
            if(req.body.directions[i] === ""){
                req.body.directions.splice(i,1)
            }
        }
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
        console.log("test: ", typeof ingredients)
        if(ingredients){
            if(Array.isArray(ingredients)){
                for(let i = 0; i<ingredients.length; i++){
                    let obj = {}
                    obj.ingredient = ingredients[i]
                    obj.measurement = measurements[i]
                    obj.measurementType = measurementTypes[i]
                    ingredientList.push(obj)
                }
            }else if(typeof ingredients === 'string'){
                let obj = {}
                obj.ingredient = ingredients
                    obj.measurement = measurements
                    obj.measurementType = measurementTypes
                    ingredientList.push(obj)
            }
        }

        //assign new array of objects to req.body.ingredientList
        req.body.ingredientList = ingredientList
       for(let i = 0; i< req.body.directions.length; i++ ){
           if(req.body.directions[i] === ""){
               req.body.directions.splice(i,1)
           }
       }
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