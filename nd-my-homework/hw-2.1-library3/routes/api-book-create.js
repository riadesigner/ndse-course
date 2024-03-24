const express = require('express')
const router = express.Router()
const store = require('../store')
const Book = require('../bookClass.js')

router.post('/create',(req,res)=>{
    const {books} = store
    const {title,description,authors,favorite,fileCover,fileName,fileBook} = req.body
    const opt = {title,description,authors,favorite,fileCover,fileName,fileBook}
    const newBook = new Book(opt)
    books.push(newBook)
    res.status(201)
    res.redirect('/api/books')    
})

router.get('/create',(req,res)=>{
    res.status(201)
    res.render('book/create',{book:{},title:'Добавление книги'})
})

module.exports = router;
