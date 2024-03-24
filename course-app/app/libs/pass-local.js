const passport = require('passport')
const LocalStrategy = require('passport-local')
const UserModule = require('../db/users')
const crypto = require('crypto');

const passportLocal = {
    init:function(router,usernameField,passwordField,failureRedirect='',successRedirect=''){                
        const fields = {usernameField,passwordField};
        this.authenticate = passport.authenticate('local',{session:true});

        this.update_router(router,fields);
        return this;
    },
    update_router:function(router,fields){                
        
        passport.use(new LocalStrategy( fields, async (email, password, done)=> {                    
          try{        
              const user = await UserModule.findByEmail(email); 
              if(!user){
                return done("неправильный логин или пароль", false );
              }else{                
                const passwordHash = crypto.createHash('md5').update(password).digest('hex');                
                const istruepass = passwordHash=== user.passwordHash;                
                if(istruepass){
                     return done(null,user)
                }else{
                    return done("неправильный логин или пароль", false );
                }            
              }
            }catch(e){
              return done("ошибка сервера", false );
            }
        }));
        
        passport.serializeUser((user, done) => {
            done(null, user._id)
        });

        passport.deserializeUser( async (id, done) => {
          try{
            const user = await UserModule.findById(id);
            if(!user){
              done(null, false)
            }else{
              done(null, user)
            }    
          }catch(e){
            done(e)
          }
        });
        
        router.use(passport.initialize())
        router.use(passport.session())                      
    
    }
}

module.exports = passportLocal;