const express = require('express')
const router = express.Router()
const store = require('../store')

router.get('/:id',(req,res)=>{    
    const {books} = store
    const {id} = req.params
    const idx = books.findIndex(el=>el.id===id)
    const title = "Просмотр книги: "
    console.log(`book id = ${id}`)
    if(idx!==-1){
        res.render('book/view',{title:title,book:books[idx]})
    }else{
        res.status(404)
        res.redirect('/404')
    }
})

module.exports = router;