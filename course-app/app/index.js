
const express = require('express')
const error404 = require('./middleware/error404')
const session = require('express-session')
const path = require('path')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000
const MONGO_URL = process.env.MONGO_URL || 'mongodb://root:example@mongo:27017/';
const MONGO_DB = process.env.MONGO_DB || 'db_course_app';
const PUBLIC_PATH = path.join(__dirname+'/public');

// ----------------
//  CONNECT TO DB
// ---------------- 
(async ()=>{    
    try{
        const db_hdlr = await mongoose.connect(MONGO_URL, {dbName:MONGO_DB});        
    }catch(e){
        console.log(e, "error connect to mongo / mongoose");        
    }    
})();


const app = express();

app.set('view engine','ejs')
app.set('views', __dirname + '/views');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public',express.static(PUBLIC_PATH))

// -----------------
//    USE SESSION
// ----------------- 

const sessionMiddleware = session({
    secret:'magic=)',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000, httpOnly: false,},
  });
  
app.use(sessionMiddleware);

// ------------
//    ROUTES
// ------------ 

app.use('/api',require('./routes/users')); // throw ajax
app.use('/api',require('./routes/advertisements')); // throw ajax
app.use('/',require('./routes/ads')); // throw browser (socket.io)

app.get('/',
(req,res)=>{    
    res.status(200)    
    res.render('home')
});

app.use(error404)

// ------------
//    SOCKET
// ------------ 

const http = require('http');
const socketIO = require('socket.io');

const server = http.Server(app);
const io = socketIO(server);

// МОДУЛЬ ОБЩЕНИЕ
const chatHandlers = require('./libs/chat-handlers')

io.on('connection', (socket) => {
    chatHandlers(io, socket);
});    

// --------------
//    START APP
// --------------  

server.listen(PORT,(err)=>{    
    if(!err){
        console.log(`Hi from port ${PORT}`)
    }else{
        console.log(err)
    }
});
