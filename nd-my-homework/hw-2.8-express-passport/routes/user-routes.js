const express = require('express')
const passport = require('passport')

const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const db = require('../db')


const router = express.Router();

// ------------
//  PASSPORT
// ------------

const sessionMiddleware = session({
    secret:'hello!',
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000, httpOnly: false,},
});

router.use(sessionMiddleware);
router.use(passport.initialize())
router.use(passport.session())

// local strategy auth
const verify = (username, password, done) => {
    db.users.findByUsername(username, (err, user) => {
        if (err) {return done(err)}
        if (!user) { return done(null, false) }
  
        if( !db.users.verifyPassword(user, password)) {
            return done(null, false)
        }
  
        return done(null, user)
    })
}
  
const options = {
  usernameField: "username",
  passwordField: "password",
}
  
passport.use('local', new LocalStrategy(options, verify))
  
passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
    db.users.findById(id,  (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
});

// ---------------
//  END PASSPORT
// ---------------



router.get('/login',   (req, res) => {
    res.render('login',{error_message:"", success_message:""})
  })

router.post('/login',
  passport.authenticate('local', { failureRedirect: '/api/user/login' }),
  (req, res) => {
    console.log("req.user: ", req.user)
    res.redirect('/api/user/admin');
})

router.post('/signup', (req, res) => {
    const  { username, password, displayName, email } = req.body;
  
    db.users.findByUsername(username, async(err, user) => {
      if (err) { console.log(err); return; }      
      if(!user){
          if(!username || !password || !email){
            let err_message = `не все обязательные поля заполнены!`;
            res.status(200)
            res.render('login',{error_message:err_message, success_message:""})
            return;
          }
          const usr = await db.users.addNew(username, password, displayName, email);          
          let success_message = `отлично, ${username}! Вы зарегистрированы. Войдите теперь с паролем и логином. `;
          res.status(200)          
          res.render('admin',{user:"",error_message:"", success_message:success_message})
      }else{
          let err_message = `пользователь с именем ${username} уже есть, выберите другое имя`;
          res.status(200)
          res.render('login',{error_message:err_message, success_message:""})
      }

    });
});

router.get("/logout", (req, res) => {
req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
});
});  

router.get('/me',
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.redirect('/api/user/login')
      }
      next()
    },
    (req, res) => {
      res.render('profile', { user: req.user })
    }
)

router.get('/admin',(req,res)=>{
  res.status(200)  
  console.log(`req=`, req.user);
  res.render('admin',{user:req.user,error_message:"", success_message:""})
})



module.exports = router;