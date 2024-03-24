const express = require('express')
const router = express.Router()
const store = require('../store')
const Book = require('../bookClass')

router.get('/',(req,res)=>{
    const {books} = store
    res.status(201)
    res.render('book/show-all',{title:"Библиотека", books:books})
})

module.exports = router;
