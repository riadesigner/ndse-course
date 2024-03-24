#!/usr/bin/env node

const readline  = require('readline')
const chalk  = require('chalk')
const fs = require('fs')
const path = require('path')

const r = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  }); 
  

const fn = {
    ask:()=>{
        const hiddenString = Math.random()*1>.5?"orel":"reshka";
        r.question(chalk.blue(`Orel ore Rechka? `), function(answer) {            
            const arr = answer.split(" ").map(item => item.toLowerCase());
            const userInputGuess = arr[0]
            const userInputFile = arr[1]
            if(!userInputFile){
                console.log(chalk.gray(`укажите через пробел (после слова orel или reshka) имя файла для записи результата`))
                console.log(chalk.white(`например: orel file1`))
                fn.ask();
            }else{                
                let res='';                 
                if(hiddenString===userInputGuess){
                    res = 'угадал!';         
                    console.log(chalk.green(res))
                }else{
                    res = 'мимо!';               
                    console.log(chalk.red(res))     
                }                
                fn.saveRes(userInputFile, res, {onSave:()=>{
                    fn.ask();
                }});
            }

            
        });  
    },
    if_file_exist:function(fileFullPath,callback){
        fs.access(fileFullPath, fs.F_OK, (err) => {
            callback(!err)     
        }) 
    },
    saveRes:(fileName, res, opt)=>{
        const file = path.join(__dirname,`${fileName}.json`);                
        fn.if_file_exist(file,(mode)=>{
            if(!mode){
                fs.writeFile(file,JSON.stringify([res]),'utf-8',(err)=>{
                    if(err) {
                        throw new Error(err)
                    }else{
                        console.log(chalk.grey(`результат записан в новый файл ${fileName}.json`))
                        opt.onSave && opt.onSave()
                    }               
                })
            }else{
                fs.readFile(file,'utf-8',(err,content)=>{
                    let arr = JSON.parse(content)                    
                    arr.push(res)
                    fs.writeFile(file,JSON.stringify(arr),'utf-8',(err)=>{
                        if(err) {
                            throw new Error(err)
                        }else{
                            console.log(chalk.grey(`результат записан в файл ${fileName}.json`))
                            opt.onSave && opt.onSave()
                        }               
                    })
                })
            }
        })
              
    }
}

fn.ask();

// console.log('Орел или Решка?',str)