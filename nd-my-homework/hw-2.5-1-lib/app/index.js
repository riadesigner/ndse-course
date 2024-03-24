
const express = require('express')
const path = require('path')


const PORT = process.env.PORT || 3000
const PUBLIC_PATH = path.join(__dirname+'/public')

// ----------------
//    MIDDLEWARE
// ---------------- 
const logger = require('./middleware/logger')

// ------------
//    ROUTES
// ------------ 

const api_books = require('./routes/books') // BOOKS ROUTS
const api_user = require('./routes/user') // USER ROUTS
const index = require('./routes/index') 
const error= require('./middleware/err-404') 

// ------------
//    SERVER
// ------------ 
const app = express()
app.set('view engine','ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public',express.static(PUBLIC_PATH))

app.use('/',logger)
app.use('/api',api_books)
app.use('/api',api_user)
app.use('/',index)
app.use(error)


app.listen(PORT,()=>{    
    console.log("ok! from post", PORT);
})