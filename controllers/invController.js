const express = require('express')
const Inventory = require('../models/inventory')
const invSeed = require('../models/seed/inventorySeed')
const router = express.Router()

router.get('/', (req,res)=>{
    try{
        Inventory.find({}, (err, allInventory)=>{
            err ? console.log(err) : res.render('indexInv.ejs', {inventory: allInventory})
        })
    }catch(err){
        console.log(err).message
    }
})

router.get('/seed', async (req,res)=>{
    try{
        const invSeedData = await Inventory.create(invSeed)
        res.redirect('/inventory')
    }catch(err){
        console.log(err.message)
    }
})

router.get('/:id', (req,res)=>{
    try{
        Inventory.findById(req.params.id, (err,foundItem)=>{
            err ? console.log(err) : res.render('showInv.ejs', {item: foundItem})
        })
    }catch(err){
        console.log(err.message)
    }
})


module.exports  = router