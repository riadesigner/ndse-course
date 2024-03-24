
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000
const PUBLIC_PATH = path.join(__dirname+'/public')
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/db_library';


// ----------------
//  CONNECT TO DB
// ---------------- 
(async ()=>{    
    try{
        const db_hdlr = await mongoose.connect(MONGO_URL, {dbName:'db_library'});        
    }catch(e){
        console.log(e, "error connect to mongo / mongoose");        
    }    
})();

// ----------------
//  MIDDLEWARE
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

// ------------
//    START APP
// ------------  
app.listen(PORT,()=>{    
    console.log("ok! from post!", PORT);
    console.log("MONGO_URL",MONGO_URL);
})


