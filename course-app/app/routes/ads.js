const express = require('express')
const Advertisement = require('../db/advertisements')
const router = express.Router();
const passportLocal = require('../libs/pass-local');
passportLocal.init(router,'email','password');



// -------------------------------
//  SHOWING THE AD BY ID FOR CHAT
// -------------------------------
router.get('/ads/:id',async (req,res)=>{
    const {id} = req.params;
    const ad = await Advertisement.findById(id);
    if(!ad){
        res.render("error")
    }else{
        let user = false;
        if(req.isAuthenticated() && req.user){
            user = req.user;
        };        
        res.render("ad",{ad:ad,user:user})
    }
    
})


module.exports = router;