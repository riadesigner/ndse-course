const yargs = require("yargs/yargs")
const {hideBin} = require("yargs/helpers");
const chalk = require('chalk');
const fs = require("fs");
const path = require("path");

const fn = {
    if_file_exist:function(fileFullPath,callback){
        fs.access(fileFullPath, fs.F_OK, (err) => {
            callback(!err)     
        }) 
    },
    show_additional_info:(content)=>{
        let scores = JSON.parse(content)
        let total_games = scores.length;        
        let your_victory = scores.filter(item=>item==='угадал!')  
        console.log(your_victory.length)
        let persent_victory = Math.floor(your_victory.length/(total_games/100)) ;
        console.log(`Всего игр: ${chalk.blue(total_games)}, ваших побед ${chalk.blue(your_victory.length)} (${chalk.blue(persent_victory)}%)` );        
    }
}

yargs(hideBin(process.argv))
.alias('help','h')
.alias('addition','a')
.command({
    command:'show',    
    describe:'Показывает содержание файла',
    builder:{
        file:{type:'string',demandOption:true, describe:'название файла (без расширения)'},
    },
    handler:(args)=>{
        if(!args.file){
            console.log(chalk.red('название файла не может быть пустым'))
        }else{
            const fileName= `${args.file}.json`;
            const p = path.join(__dirname,fileName)
            fn.if_file_exist(p,(mode)=>{
                if(!mode){
                    console.log(chalk.red(`файл с именем ${fileName} не найден`))
                }else{
                    fs.readFile(p,'utf-8',(err,content)=>{
                        if(err) throw new Error(err)
                        console.log(chalk.green(content))
                        args.addition && fn.show_additional_info(content);
                    })   
                }
            })
        
        }        
    }
})
.parse()