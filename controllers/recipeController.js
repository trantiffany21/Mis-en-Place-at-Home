const express = require('express')
const Recipe = require('../models/recipes')

const router = express.Router()

const errorCheck = (err)=>{
    if(err){
        console.log(err)
    }
}
router.get('/', (req,res)=>{
    Recipe.find({}, (err, allRecipes)=>{
        errorCheck(err)
        res.send(allRecipes)
    })
})
router.get('/seed', async (req,res)=>{
        const data = [{
            name: 'Grilled Cheese', 
            cuisine: ['American'], 
            servingSize: 1,
            ingredientList: [
                {
                ingredient: 'toast slice',
                measurement: 2, 
                },
                {
                    ingredient: 'cheese slice',
                    measurement: 2, 
                },
                {
                    ingredient: 'butter',
                    measurement: 1,
                    measurementType: 'tablespoon' 
                }], 
            
            directions: [{
                step: 1, 
                direction: `Preheat skillet over medium heat. Generously butter one side of a slice of bread. Place bread butter-side-down onto skillet bottom and add 1 slice of cheese. Butter a second slice of bread on one side and place butter-side-up on top of sandwich. Grill until lightly browned and flip over; continue grilling until cheese is melted. Repeat with remaining 2 slices of bread, butter and slice of cheese.`
            }], 
            notes: 'good, add bacon for extra flavor',
    }]
    try{
        const seed = await Recipe.create(data)
        res.send(Recipe)
    }catch(err){
        console.log(err.message)
    }
})


module.exports  = router