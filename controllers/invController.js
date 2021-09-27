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
router.get('/:id/edit', (req,res)=>{
    try{
        Inventory.findById(req.params.id, (err, foundItem)=>{
            err ? console.log(err) : res.render('editInv.ejs', {item: foundItem})
        })
        
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

router.put('/:id', (req,res)=>{
    try{
        console.log(req.body)
        Inventory.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedItem)=>{
            if(err){
                console.log(err)
                res.redirect(`/inventory/${req.params.id}/edit`)
            }else{
                
                res.redirect(`/inventory/${req.params.id}`)
            }
        })
    }catch(err){
        console.log(err.message)
    }
})

router.delete('/:id', (req,res)=>{
    try{
        Inventory.findByIdAndDelete(req.params.id, (err, deletedItem)=>{
            err ? console.log(err) : res.redirect('/inventory')
        })
        
    }catch(err){
        console.log(err.message)
    }
})

module.exports  = router