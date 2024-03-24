const express = require('express')
const router = express.Router()
const store = require('../store')
const path = require('path')

router.get('/:id/download',(req,res)=>{    
    const {books} = store
    const {id} = req.params
    const idx = books.findIndex(el=>el.id===id)
    if(idx!==-1){
        if(books[idx].fileBook){
            const bookPath = path.join(__dirname,'..',books[idx].fileBook);
            console.log(`bookPath=${bookPath}`)
            res.status(200)        
            res.sendFile(bookPath)
        }else{
            res.status(200)
            res.json('у книги пока нет файла')            
        }
    }else{
        res.status(404)
        res.redirect('/404')
    }
})

module.exports = router;