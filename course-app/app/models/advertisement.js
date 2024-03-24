const {Schema, model} = require('mongoose')

const advertisementSchema = new Schema({
    shortTitle:{
        type:String,
        required:true
    },
    description:{
        type:String        
    },
    images:{
        type:Array        
    },
    userId:{
        type:String, 
        required:true       
    },
    createdAt:{
        type:Date, 
        required:true        
    },
    updatedAt:{
        type:Date, 
        required:true        
    },
    tags:{
        type:Array
    },
    isDeleted:{
        type:Boolean,
        required:true,
        default:false
    }
});

module.exports = model('advertisements', advertisementSchema);