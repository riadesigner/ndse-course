#!/usr/bin/env node

const yargs = require("yargs/yargs")
const args = yargs(process.argv.slice(2)).argv

const msgNoVars = "Дайте параметры";
const msgNeedMoreParams = "Нужно больше параметров";


if(args._.length>0 && args._.includes('current')){
    (args.y || args.year) && show_current_year();
    (args.m || args.month) && show_current_month();
    (args.d || args.date) && show_current_date();
    if(!args.m && !args.month && !args.y && !args.year && !args.d && !args.date ){
        show_iso_datetime();
    }
}else if(args._.length>0 && args._.includes('add')){
    if(args.d || args.date){
        const days_diff = args.d || args.date;                    
        if(days_diff===true || days_diff===false ){
            console.log(msgNeedMoreParams)
        }else{
            show_date_add(days_diff);
        }        
    }else if(args.m || args.month){
        const month_diff = args.m || args.month;  
        if(month_diff===true || month_diff===false){
            console.log(msgNeedMoreParams)
        }else{
            show_month_add(month_diff);        
        }        
    }else{
        console.log(msgNoVars);
    }
}else if(args._.length>0 && args._.includes('sub')){
    if(args.d || args.date){        
        const days_diff = args.d || args.date;    
        if(days_diff===true || days_diff===false){
            console.log(msgNeedMoreParams);
        }else{
            show_date_sub(days_diff);
        }        
    }else if(args.m || args.month){
        const month_diff = args.m || args.month;    
        if(month_diff===true || month_diff===false){
            console.log(msgNeedMoreParams);
        }else{
            show_month_sub(month_diff);        
        }
        
    }else{
        console.log(msgNoVars);
    }
}else{
    console.log(msgNoVars);
}

function show_current_month(){ 
    const formatter = new Intl.DateTimeFormat('ru', { month: 'long' });
    const month1 = formatter.format(new Date().getMonth());
    console.log(`месяц: ${month1}`)
}
function show_current_year(){ console.log(`год: ${new Date().getFullYear()}`)}
function show_current_date(){ console.log(`число: ${new Date().getDate()}`)}
function show_iso_datetime(date){ 
    if(date){
        console.log(`iso время: ${date.toISOString()}`)
    }else{
        console.log(`iso время: ${new Date().toISOString()}`)
    }
}

function show_date_add(n){
    let d = new Date();
    d.setDate(d.getDate() + n);
    console.log(`через ${n} дня(дней) будет:`);
    show_iso_datetime(d);
}
function show_date_sub(n){
    let d = new Date();
    d.setDate(d.getDate() - n);
    console.log(`${n} дня(дней) назад было:`);
    show_iso_datetime(d);
}
function show_month_add(n){
    let d = new Date();
    d.setMonth(d.getMonth() + n);
    console.log(`через ${n} месяц(ца/цев) будет:`);
    show_iso_datetime(d);
}
function show_month_sub(n){
    let d = new Date();
    d.setMonth(d.getMonth() - n);
    console.log(`${n} месяц(ца/цев) назад было:`);
    show_iso_datetime(d);
}
