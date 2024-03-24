const {Schema, model} = require('mongoose')

const messageSchema = new Schema({
    author:{
        type:String,
        required:true
    },
    sentAt:{
        type:Date,
        required:true
    },
    text:{
        type:String,
        required:false
    },
    readAt:{
        type:Date,
        required:false
    }
});

const chatSchema = new Schema({
    users:{
        type:Array,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    },
    messages:[messageSchema]
});

exports.MessageModel = model('message', messageSchema);
exports.ChatModel = model('chat', chatSchema);