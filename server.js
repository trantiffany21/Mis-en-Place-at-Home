const express = require('express')
const app = express()
const methodOverride = require('method-override')

//Environment variables
require('dotenv').config()
const PORT = process.env.PORT

const Recipe = require('./models/recipes')
const Inventory = require('./models/inventory')

//database
const mongoose = require('mongoose')
const mongoURI = process.env.MONGODB_URI
const db = mongoose.connection

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=>{
    console.log('database connected')
})

db.on('error', (err) => {console.log('ERROR: ', err)})
db.on('connected', () => {console.log('mongo connected')})
db.on('disconnected', (err) => {console.log('mongo disconnected')})

//MIDDLEWARE
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))

//Controllers
const recipeController = require('./controllers/recipeController')
app.use('/recipes', recipeController)
const invController = require('./controllers/invController')
app.use('/inventory', invController)

app.get('/', (req,res)=>{
    res.redirect('/recipes')
})

app.listen(PORT,()=>{
    console.log("Listening on PORT ", PORT)
})