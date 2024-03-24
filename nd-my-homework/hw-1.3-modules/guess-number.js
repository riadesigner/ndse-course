#!/usr/bin/env node

const readline = require('readline');

const my_hidden_num = Math.floor(Math.random()*100);

const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });        

const fn = {
    ask:()=>{
        r.question("Я загадал число, угадай, какое?", function(answer) {
            answer = parseInt(answer,10);   
            
            if(!answer){
                console.log('число то назови...')
                fn.ask();
                return false;
            }         
            
            console.log(`ты сказал ${answer}?`)                        
            if(answer>my_hidden_num){
                console.log(`не, мое число меньше`);
                fn.ask();                
            }else if(answer<my_hidden_num){
                console.log(`не, мое число больше`);
                fn.ask();                
            }else if(answer= my_hidden_num){
                console.log(`ух ты! Угадал!!!, ${answer}=${my_hidden_num} `);
                r.close();
            }
          });  
    }
}

fn.ask();



