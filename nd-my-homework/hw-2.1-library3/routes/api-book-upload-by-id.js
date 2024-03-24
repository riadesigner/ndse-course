require('dotenv').config()

const express = require('express')
const router = express.Router()
const store = require('../store')
const fileMulter = require('../middleware/file-book')
const path = require('path')
const PORT = process.env.PORT || 3000;

router.post('/:id/upload',fileMulter.single('book-file'),(req,res)=>{
    const {books} = store
    const {id} = req.params    
    if(req.file){
        const {path:path_file} = req.file;
        res.status(200)

        const idx = books.findIndex(el=>el.id===id)
         
        if(idx!==-1){
            books[idx].fileBook = path_file;
        }
        console.log(`req.baseUrl = ${req.baseUrl}`)
        const book_path = `http://localhost:${PORT}/${path_file}`;
        const answer = `книга (id): ${id.toString()}, файл книги: ${book_path}`;
        console.log(answer)                
        res.json(answer)

    }else{
        res.status(201)
        res.json('201 | файл книги то прикрепите')        
    }
})

module.exports = router;