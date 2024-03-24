const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.status(201)
    const goto = 'localhost:3000/api/books';
    const invite_message = `перейдите на страницу: <a href="http://${goto}">${goto}</a>`;    
    res.render('index',{invite_message:invite_message,title:"Библиотека"})
})

module.exports = router;
