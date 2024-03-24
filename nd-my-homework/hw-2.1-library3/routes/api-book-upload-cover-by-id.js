const express = require('express')
const router = express.Router()
const store = require('../store')
const multer = require('../middleware/file-book-cover')

router.post('/:id/upload-cover',multer.single('book-cover'),(req,res)=>{
    const {books} = store
    const {id} = req.params
    
    if(req.file){
        const {path} = req.file;                
        
        const idx = books.findIndex(el=>el.id===id)
        if(idx!==-1){
            books[idx].fileCover = path;
        }
        const answer = `книга (id): ${id.toString()}, обложка: ${path}`;
        console.log(answer)        
        res.status(201)
        res.json(answer)
    }else{
        res.status(201)
        res.json('201 | обложку то прикрепите')        
    }
})

module.exports = router;