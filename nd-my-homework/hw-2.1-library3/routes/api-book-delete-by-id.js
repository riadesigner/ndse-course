const express = require('express')
const router = express.Router()
const store = require('../store')

router.post('/:id/delete',(req,res)=>{
    const {books} = store
    const {id} = req.params
    const idx = books.findIndex(el=>el.id===id)
    if(idx !== -1){
        books.splice(idx,1)
        res.status(201)
        res.redirect('/api/books')
    }else{
        res.status(404)
        res.redirect('/404')        
    }
})

module.exports = router;