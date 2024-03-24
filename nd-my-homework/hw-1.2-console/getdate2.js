#!/usr/bin/env node

const yargs = require("yargs/yargs")
const { hideBin } = require('yargs/helpers')
const pkg = require('./package.json')

const args = yargs(hideBin(process.argv))
.version(pkg.version)
.alias('date','d')
.alias('month','m')
.alias('year','y')
.alias('help','h')
.alias('version','v')
.command({

    command:'add',
    describe:'Additing some days or month to current date',
    builder:{
        days:{type:'number',describe:'number of days to additing'},
        month:{type:'number',describe:'number of month to additing'}
    },
    handler: (args)=>{        
        if(!args.d && !args.m){            
            console.log('missing options, use add --month <nunmber> or add --days <nunmber>')
            return false;
        }else{
            if(args.d){
                let d = new Date();
                d.setDate(d.getDate() - args.d);
                console.log(`через ${args.d} дней(день/дня) будет:`);
                show_iso_datetime(d)
            }else if(args.m){                
                let d = new Date();
                d.setMonth(d.getMonth() - args.m);
                console.log(`через ${args.m} месяц(ца/цев) будет:`);
                show_iso_datetime(d)
            }
        }   
    }
})
.command({

    command:'sub',
    describe:'Showing date for some days or month ago',
    builder:{
        days:{type:'number',describe:'number of days ago'},
        month:{type:'number',describe:'number of month ago'}
    },
    handler: (args)=>{        
        if(!args.d && !args.m){            
            console.log('missing options, use sub --month <nunmber> or sub --days <nunmber>')
            return false;
        }else{
            if(args.d){
                let d = new Date();
                d.setDate(d.getDate() - args.d);
                console.log(`${args.d} дней назад было:`);
                show_iso_datetime(d)
            }else if(args.m){                
                let d = new Date();
                d.setMonth(d.getMonth() - args.m);
                console.log(`${args.m} месяц(ца/цев) назад было:`);
                show_iso_datetime(d)
            }
        }   
    }
})
.command({
    command:'current',
    describe:'showing current date',
    handler:(argv)=>{
        let now = new Date();
        let date = argv.d?`день ${now.getDate()}`:"";        
        let month = argv.m?`месяц ${now.getMonth()}`:"";
        let year = argv.y?`год ${now.getFullYear()}`:"";
        if(month || year || date){
            console.log(`Сейчас: ${date} ${month} ${year}`);
        }else{
            show_iso_datetime(new Date());
        }
    }    
})
.parse();

if(!args._.includes('current') 
&& !args._.includes('add') 
&& !args._.includes('sub')){    
    show_iso_datetime(new Date());
}

function show_iso_datetime(date){ 
    console.log(`iso время: ${date.toISOString()}`)
}