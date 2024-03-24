const express = require('express')
const router = express.Router()
const store = require('../store')
const Book = require('../bookClass')
const path = require('path')
const fileMulter = require('../middleware/file-book')
const fileMulterCover = require('../middleware/file-book-cover')
const PORT = process.env.PORT || 3000;

// ---------------
//    SHOW ALL
// ---------------

router.get('/books',(req,res)=>{
    const {books} = store
    res.status(201)
    res.render('book/show-all',{title:"Библиотека", books:books})
})

// ---------------
//    CREATE
// ---------------

router.post('/books/create',(req,res)=>{
    const {books} = store
    const {title,description,authors,favorite,fileCover,fileName,fileBook} = req.body
    const opt = {title,description,authors,favorite,fileCover,fileName,fileBook}
    const newBook = new Book(opt)
    books.push(newBook)
    res.status(201)    
    res.redirect('/api/books')    
})

router.get('/books/create',(req,res)=>{
    res.status(201)
    res.render('book/create',{book:{},title:'Добавление книги'})    
})

// ---------------
//      SHOW
// ---------------

router.get('/books/:id',(req,res)=>{    
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


// ---------------
//    DELETE
// ---------------

router.post('/books/:id/delete',(req,res)=>{
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

// ---------------
//    DOWNLOAD
// ---------------

router.get('/books/:id/download',(req,res)=>{    
    const {books} = store
    const {id} = req.params
    const idx = books.findIndex(el=>el.id===id)
    if(idx!==-1){
        if(books[idx].fileBook){
            const bookPath = path.join(__dirname,'..',books[idx].fileBook);
            console.log(`bookPath=${bookPath}`)
            res.status(200)            
            const filename = `Книга-${id}.txt`;
            res.download(bookPath, filename)
        }else{
            res.status(200)
            res.json('у книги пока нет файла')            
        }
    }else{
        res.status(404)
        res.redirect('/404')
    }
})

// ---------------
//    UPDATE
// ---------------

router.post('/books/:id/update',(req,res)=>{
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

router.get('/books/:id/update',(req,res)=>{
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

// ------------------
//    UPLOAD BOOK
// ------------------

router.post('/books/:id/upload',fileMulter.single('book-file'),(req,res)=>{
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

// ------------------
//    UPLOAD COVER
// ------------------
 
router.post('/books/:id/upload-cover',fileMulterCover.single('book-cover'),(req,res)=>{
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