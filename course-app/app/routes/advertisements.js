const express = require('express')
const Advertisement = require('../db/advertisements')
const UserModule = require('../db/users')
const upload = require('../middleware/file-ads-images')

const router = express.Router();

const passportLocal = require('../libs/pass-local');
passportLocal.init(router,'email','password');


// ----------------------
//  SHOWING THE AD BY ID
// ----------------------
router.get('/advertisements/:id',async (req,res)=>{
  try{
    const {id} = req.params;
    const ad = await Advertisement.findById(id);
    if(!ad){
      throw new Error("объявление не найдено");
    }else{
      res.status(200)
      res.json({
        "data":ad,
        "status":"ok"
      })
    }
  }catch(e){
    res.status(401)
    res.json({
      "error":`${e}`,
      "status":"error"
    })
  }
})

// ------------------
//  SEARCHING THE AD
// ------------------
/**
 * на вход принимает json
 * {
 *  "id":"",
 *  "search":"555", 
 *  "tags":["vvv","999"]
 * }
 *  
*/
router.get('/advertisements',async (req,res)=>{

    try{

      const {id} = req.body || false;       
      const {search} = req.body || false;       
      const {tags} = req.body || [];       
      const params = {search,tags,id};

      const arr_ads = await Advertisement.find(params);      
      res.status(200)
      res.json({
        data:arr_ads,
        status:"ok"
      });

    }catch(e){
      res.status(200)
      res.json({
        "error": `ошибка поиска объявлений, ${e}`,
        "status": "error"      
      });    
    }

});

// ------------------
//  REMOVING THE AD
// ------------------
router.delete('/advertisements/:id_advertisement',
async (req,res)=>{
  
  if(!req.isAuthenticated() || !req.user){
    res.status(401);
    res.json({
      error:"требуется авторизация",
      status:"error"
    });
    return; 
  }  
  const user = req.user;
  let {id_advertisement} = req.params
  id_advertisement = id_advertisement.trim();
  const adds = await Advertisement.findById(id_advertisement)
  if(!adds){
    res.status(200);
    res.json({
      "error":"такого объявления не существует (или было удалено)",
      "status":"error"
    })  
  }else{
    if(user._id.toString()!==adds.userId.toString()){
      res.status(403);
      res.json({
        "error":`это не ваше объявление`,
        "status":"error"
      })      
    }else{
      const ok = await Advertisement.remove(id_advertisement);
      if(ok){
        res.status(200);
        res.json({
          "data":`объявление ${id_advertisement} удалено`,
          "status":"ok"
        })
      }else{
        res.status(200);
        res.json({
          "data":`не удалось удалить объявление с id ${id_advertisement}`,
          "status":"error"
        })
      }              
    }
  }  

}
);

// ---------------------
//  CREATION A NEW AD
// ---------------------
router.post('/advertisements',
async (req,res,next)=>{
  
  // есть или аторизация
  if(!req.isAuthenticated() || !req.user){
    return next("требуется авторизация")    
  }

  // проверяем пользователя на наличие в бд
  try{
    const user = await UserModule.findById(req.user._id);
  }catch(e){
    return next("такого пользователя уже нет в базе данных")    
  }
    
  next();

},

upload.array('images'),

(err,req,res,next)=>{
  if(err){
    res.status(200)
    res.json({
      "error":err,
      "status":"error"
    })
  }else{
    next();
  }  
},
  async (req,res)=>{    
    let arr_images=[];
    if(req.files && req.files.length){
      for(let i in req.files){
        arr_images.push(req.files[i].filename);
      }
    }

    let {shortTitle,description} = req.body;  
    shortTitle = shortTitle||"Untitled";
    description = description||"";

    // сохраняем объявление
    try{
        const data = {
          shortTitle:shortTitle,
          description:description,
          images:arr_images,
          userId:req.user._id,
          createdAt:new Date(),
          updatedAt:new Date(),
          tags:[],
          isDeleted:false
        };

        const newAd = await Advertisement.create(data);    
        if(!newAd){
          throw new Error("не удалось добавить объявление")
        }else{
          res.json({
            "data":newAd,
            "status":"ok"
          })
        }

    }catch(e){
      res.json({
        "error":e,
        "status":"error"
      })
    }    

  }
);


module.exports = router;