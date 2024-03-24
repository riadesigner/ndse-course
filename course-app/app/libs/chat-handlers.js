/** 
 * 
 * МОДУЛЬ ОБЩЕНИЕ
 * 
*/

const Chat = require('../db/chat');
const UserModule = require('../db/users');

// EXAMPLE OF SUBSCRIBING ON MESSAGES
Chat.subscribe((data)=>{
  const {chatId,message} = data;
  console.log(`New message sent! ${chatId}, ${message}`);
});

module.exports = async (io, socket)=>{
  
  console.log(`io, socket, ${io} ${socket}`)

  const {id} = socket;
  console.log(`Socket connected: ${id}!!`);

  const {user1Id,user2Id,room} = socket.handshake.query;

  try{
    // check: if users are real
    const user1 = await UserModule.findById(user1Id);
    const user2 = await UserModule.findById(user2Id);  
    if(!user1 || !user2){ throw new Error("unknown users"); }    

    socket.join(room); // room = 'room-<user1Id>-<user2Id>';  

    // -------------------------
    // INPUT EVENT: getHistory
    // -------------------------    
    socket.on("getHistory", async (users_ids)=>{
      const user1Id = users_ids[0];
      const user2Id = users_ids[1];
      const chat = await Chat.find(user1Id,user2Id);
      // -------------------------
      // OUTPUT EVENT: chatHistory
      // -------------------------  
      const messages = chat?chat.messages : [];
      io.to(room).emit("chatHistory",messages);
    });
    
    // -------------------------
    // INPUT EVENT: sendMessage
    // -------------------------    
    socket.on("sendMessage",async (opt)=>{        
      const {receiver, text} = opt;
      const author = user1Id; // current user
      try{        
        // save the message in db
        const message = await Chat.sendMessage({ author:author, receiver:receiver, text:text });        
        if(message){
          // -------------------------
          // OUTPUT EVENT: newMessage
          // -------------------------  
          io.to(room).emit("newMessage",message)           
        }else{
          throw new Error("2. cant sending the message");
        }
      }catch(e){
        console.log(`1. cant sending the message! ${e}`)
        io.to(room).emit("error",`cant sending the message: ${msg}`)      
      }
      
    });

  }catch(e){
    const answer = {
      "error":"unknown users!",
      "status":"error"
    }
    io.to(socket.id).emit("message",answer);
    console.log(e)
  }

  socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${id}`);
  });

}