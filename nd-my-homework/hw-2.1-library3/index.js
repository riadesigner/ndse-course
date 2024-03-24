require("dotenv").config()

const express = require('express')
const path = require('path')


const PORT = process.env.PORT || 3001

// ----------------
//    MIDDLEWARE
// ---------------- 
const logger = require('./middleware/logger')

// ------------
//    ROUTES
// ------------ 

// --- API REST ---
const r_booksGetAll = require('./routes/api-books-get-all') 
const r_bookCreate = require('./routes/api-book-create')
const r_bookGetById = require('./routes/api-book-get-by-id')
const r_bookDeleteById = require('./routes/api-book-delete-by-id') 
const r_bookUpdateById = require('./routes/api-book-update-by-id') 
const r_bookDownloadById = require('./routes/api-book-download-by-id') 
const r_bookUploadCoverById = require('./routes/api-book-upload-cover-by-id') 
const r_bookUploadById = require('./routes/api-book-upload-by-id') 

const r_loginRoute = require('./routes/login') 
const r_index = require('./routes/index') 
const r_error= require('./middleware/err-404') 

// ------------
//    SERVER
// ------------ 
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/',logger)

const public_path = path.join(__dirname+'/public')
app.use('/public',express.static(public_path))

app.set('view engine','ejs')

// -- API REST --
app.use('/api/books',r_booksGetAll)
app.use('/api/books',r_bookCreate) 
app.use('/api/books',r_bookGetById)
app.use('/api/books',r_bookDeleteById)
app.use('/api/books',r_bookUpdateById)
app.use('/api/books',r_bookUploadCoverById)
app.use('/api/books',r_bookUploadById)
app.use('/api/books',r_bookDownloadById)


app.use('/api/user/login',r_loginRoute)
app.use('/',r_index)
app.use(r_error)



app.listen(PORT,()=>{
    console.log("ok!");
})