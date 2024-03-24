const EventEmitter = require('node:events');
class ChatEmitter extends EventEmitter {}
const emitter = new ChatEmitter();


const {ChatModel, MessageModel} = require('../models/chat');

exports.sendMessage = function(options){  
  return new Promise( async(res,rej)=>{  
      try{
        const {author,receiver,text} = options;         
        let chat = await exports.find(author,receiver);         
        if(!chat) chat = await exports.create(author,receiver);          
        const newMessage = await MessageModel.create({
          author:author,
          sentAt:new Date(),
          text:text
        });           
        await chat.messages.push(newMessage);
        await chat.save();          
        emitter.emit("newMessage",{chatId:chat._id,message:newMessage})
        res(newMessage);
      }catch(e){
        console.log(`error sending message ${e} `)        
        res(null);
      }    
  });
}
exports.find = function(user1Id,user2Id){
  return new Promise( async(res,rej)=>{  
    try{
      const chat = await ChatModel.findOne({users:{$all:[user1Id,user2Id]}});
      res(chat)
    }catch(e){
      rej(null)
    }     
  })
}

exports.create = function(user1Id,user2Id){
  return new Promise( async(res,rej)=>{  
    try{
      const chat = await ChatModel.create({
        users:[user1Id,user2Id],
        createdAt:new Date()
      });
      await chat.save();        
      res(chat);
    }catch(e){
      console.log(`err, ${e}`)
      rej(null)
    }
  })
}

exports.getHistory = function(id){
  return new Promise(async (res,rej)=>{
    try{
      const messages = await ChatModel.find({_id:id}).select('messages').select('-__v');
      res(messages);
    }catch(e){
      rej(null)
    }
  })
};

exports.subscribe = function(foo){
  emitter.on("newMessage",function(opt){    
    foo&&foo(opt);
  })
};
