
const UserModule = require('../db/users');
const AdvertisementModel = require('../models/advertisement');

function singlePacked(ad,user){
  return data = {
    "id": ad._id,
    "shortTitle": ad.shortTitle||"untitled",
    "description": ad.description||"",
    "images": ad.images||[],
    "user": {
      "id": user._id,
      "name": user.name
    },
    "createdAt": ad.createdAt
  }
}
async function manyPacked(arr_ads){
  const arr_data = [];
  if(arr_ads && arr_ads.length){
    for (let i in arr_ads){
      let ad = arr_ads[i];
      const user = await UserModule.findById(ad.userId.toString());      
      const data = singlePacked(ad,user);
      arr_data.push(data);
    }
  }
  return arr_data;
}



exports.findById = function (id) {
  return new Promise(async (res,rej)=>{
    try{        
      const ad = await AdvertisementModel.findById(id);
      if(ad && !ad.isDeleted){
        const user = await UserModule.findById(ad.userId.toString());      
        const data = singlePacked(ad,user);
        res(data); 
      }else{
        throw new Error("was removed");
      }        
    }catch(e){
      console.log(`cant find advertisement by id${id}, err:${e}`)
      res(null);
    }
  })
}

exports.remove = function (id) {
  return new Promise(async (res,rej)=>{
    try{        
      const adById = await exports.findById(id);
      adById.isDeleted = true;
      adById.save();
      res(true); 
    }catch(e){
      console.log(`cant find advertisement by id${id}, err:${e}`)
      res(false);
    }
  })
}  

exports.create = function (data) {  
    return new Promise(async (res,rej)=>{ 
      try{
        const ad = await AdvertisementModel.create(data);
        ad.save();
        const user = await UserModule.findById(ad.userId.toString());      
        const answer = singlePacked(ad,user);
        res(answer);
      }catch(e){
        console.log(`cant create new Advertisement, err:${e}`)
        res(null);
      }        
    })    
}  

exports.find = function (params){
  return new Promise(async (res,rej)=>{      
    try{
      
      const {search,tags,id} = params;

      if(id){
        // find by id
        const ad = await exports.findById(id);        
        if(ad){ res(ad); return; }        
      };
      
      if(!id && !search && (!tags || !tags.length)){
        // show all adds
        const ads = (await AdvertisementModel.find({isDeleted:false}));
        res(manyPacked(ads));
      }else{ 

        let  allAds = [];
        // fulltext finding by keyword
        if(search){
          const msk = new RegExp(search,'i');
          const matchedAdds = await AdvertisementModel.find({$or:[{shortTitle:msk},{description:msk}],isDeleted:false});
          allAds = allAds.concat(matchedAdds);
        };
        // fulltext finding by tags
        if(tags && tags.length){            
          let arr_conds = [];
          for (let i in tags){
            const msk = new RegExp(tags[i],'i');
            arr_conds.push({shortTitle:msk});
            arr_conds.push({description:msk});
          };            
          const matchedTagsAdds = await AdvertisementModel.find({$or:arr_conds,isDeleted:false});        
          allAds = allAds.concat(matchedTagsAdds);
        }          
        res(manyPacked(allAds));          
      }    
    }catch(e){
      console.log(`cant find any Advertisement, err:${e}`)
      res(null);
    }       
  })
}