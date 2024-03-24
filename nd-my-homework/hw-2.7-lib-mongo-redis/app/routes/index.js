const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{    
    res.status(201)
    const goto = `/api/books`;
    const invite_message = `перейдите на страницу: <a href="${goto}">${goto}</a>`;    
    res.render('index',{invite_message:invite_message,title:"Библиотека"})
})

module.exports = router;
