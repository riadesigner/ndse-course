const express = require('express')
const routerUser = require('./routes/user-routes')
const error404 = require('./middleware/error-404') 


const PORT = process.env.PORT || 3001;
const app = express();

app.set('view engine','ejs')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user',routerUser)

app.get('/',
(req,res)=>{    
    res.status(200)
    res.render('home')
})

app.use(error404)


app.listen(PORT,(err)=>{
    if(err) console.log(err);    
    console.log(`hi, I am listerning ${PORT}`)
    console.log(`http://localhost:${PORT}`)
});