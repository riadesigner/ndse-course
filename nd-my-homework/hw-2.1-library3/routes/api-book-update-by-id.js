const express = require('express')
const router = express.Router()
const store = require('../store')

router.post('/:id/update',(req,res)=>{
    const {books} = store
    const {id} = req.params
    const {title,description,authors,favorite,fileCover,fileName} = req.body
    const opt = {title,description,authors,favorite,fileCover,fileName}
    const idx = books.findIndex(el=>el.id===id)
    if(idx !== -1){        
        books[idx].update(opt)
        res.status(201)        
        res.redirect('/api/books')
    }else{
        res.status(404)
        res.json('404 | книга не найдена')
    }
})

router.get('/:id/update',(req,res)=>{
    const {books} = store
    const {id} = req.params
    const idx = books.findIndex(el=>el.id===id)
    if(idx !== -1){                
        const book = books[idx];
        res.status(201)
        res.render('book/update',{title:'Редактирование книги', book:book })            
    }else{
        res.status(404)
        res.redirect('/404')
    }
})

module.exports = router;