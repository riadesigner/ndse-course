const express = require('express')
const router = express.Router()
const path = require('path')
const fileMulter = require('../middleware/file-book')
const fileMulterCover = require('../middleware/file-book-cover')
const BookModel = require('../models/book');
var request = require('request');

// ---------------
//    SHOW ALL
// ---------------

router.get('/books',async (req,res)=>{
    try{        
        const books = await BookModel.find();        
        res.status(201)
        res.render('book/show-all',{title:"Библиотека", books:books})
    }catch(e){
        console.log(`err ${e}`);
        res.status(404);
        res.redirect('/404');
    }
})

// ---------------
//    CREATE
// ---------------

router.post('/books/create',async (req,res)=>{    
    const {title,description,authors,favorite,fileCover,fileName,fileBook} = req.body
    const opt = {title,description,authors,favorite,fileCover,fileName,fileBook}
    try{
        const newBook = new BookModel(opt);
        await newBook.save();
        res.status(201)    
        res.redirect('/api/books')            
    }catch(e){
        console.log(`cant to save the new book, err: ${e}`);
        res.status(404);
        res.redirect('/404');
    }
})

router.get('/books/create',(req,res)=>{
    res.status(201)
    res.render('book/create',{book:{},title:'Добавление книги'})    
})

// ---------------
//      SHOW
// ---------------

router.get('/books/:id',async (req,res)=>{       
    const title = "Просмотр книги: "
    const {id} = req.params

    let viewsCount = 0;

    let counter_url = process.env.COUNTER_URL;    
    try{
        const options = {
            uri: `${counter_url}/counter/${id}/incr`,
            method: 'POST',
            headers: {'content-type' : 'application/json'},
            json: true,
            body:{}
            };                       
            request(options, async(error, result, body) =>{
                if (!error && result.statusCode == 200) {
                    viewsCount = body.total;
                    console.log("viewsCount!!!",viewsCount)
                    const book = await BookModel.findById(id);        
                    res.render('book/view',{title:title,book:book, viewsCount:viewsCount});

                }else{
                    throw new Error('cant update count of book views');
                }
            });   
    }catch(e){
        console.log(e)
        res.status(404);
        res.redirect('/404');        
    }
          
})


// ---------------
//    DELETE
// ---------------

router.post('/books/:id/delete',async (req,res)=>{    
    const {id} = req.params
    try{        
        await BookModel.deleteOne({_id:id});
        res.status(201)
        res.redirect('/api/books')        
    }catch(e){
        console.log(`cant deleting the book ${id}, err:${e}`)
        res.status(404)
        res.redirect('/404')        
    }
})

// ---------------
//    DOWNLOAD
// ---------------

router.get('/books/:id/download',async (req,res)=>{        
    const {id} = req.params
    try{
        const book = await BookModel.find({_id:id});
        if(book.fileBook){
            const bookPath = path.join(__dirname,'..',book.fileBook);
            console.log(`bookPath=${bookPath}`)
            res.status(200)            
            const filename = `Книга-${id}.txt`;
            res.download(bookPath, filename)
        }else{
            res.status(200)
            res.json('у книги пока нет файла')            
        }        
    }catch(e){
        console.log(`not found the book ${id}, err: ${e}`);
        res.status(404)
        res.redirect('/404')
    }

})

// ---------------
//    UPDATE
// ---------------

router.post('/books/:id/update',async (req,res)=>{    
    const {id} = req.params
    const {title,description,authors,favorite,fileCover,fileName} = req.body
    const opt = {title,description,authors,favorite,fileCover,fileName}    
    try{                
        await BookModel.findByIdAndUpdate(id,opt);        
        res.status(201)        
        res.redirect('/api/books')
    }catch(e){
        console.log(`not found book ${id}, err: ${e}`)
        res.status(404)
        res.redirect('/404')
    }

})

router.get('/books/:id/update',async (req,res)=>{    
    const {id} = req.params
    const title = 'Редактирование книги';
    try{
        const book  = await BookModel.findOne({_id:id});
        res.status(201)
        res.render('book/update',{title:title, book:book })                    
    }catch(e){
        console.log(`not found book ${id}, err: ${e}`)
        res.status(404)
        res.redirect('/404')
    }
})

// ------------------
//    UPLOAD BOOK
// ------------------

router.post('/books/:id/upload',fileMulter.single('book-file'), async (req,res)=>{
    const {id} = req.params    
    if(req.file){
        try{
            const book = await BookModel.findById({_id:id}).select('-__v');
            const {path:path_file} = req.file;
            book.fileBook = path_file;            
            await book.save();
            const answer = `книга (id): ${id}, файл книги: ${path_file}`;
            res.status(200);
            res.json({"ok":answer})
        }catch(e){
            res.status(404)
            res.redirect('/404')
        };
    }else{
        res.status(201)
        res.json('201 | файл книги то прикрепите')        
    }
})

// ------------------
//    UPLOAD COVER
// ------------------
 
router.post('/books/:id/upload-cover',fileMulterCover.single('book-cover'),async (req,res)=>{
    
    const {id} = req.params
    
    if(req.file){
        const {path} = req.file;                
        try{
            const book = await BookModel.findById({_id:id}).select('-__v');
            book.fileCover = path;
            await book.save();
            const answer = `книга (id): ${id.toString()}, обложка: ${path}`;
            res.status(201)
            res.send(answer)
            
        }catch(e){
            console.log(`not found the book ${id}, err: ${e}`)
            res.status(404)
            res.redirect('/404')                        
        }

    }else{
        res.status(201)
        res.json('201 | обложку то прикрепите')        
    }
})

module.exports = router;