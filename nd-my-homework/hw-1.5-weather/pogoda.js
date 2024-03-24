require("dotenv").config()

const http = require('http')
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const chalk = require('chalk')

const choosen_city = hideBin(process.argv).join(' ');
if(!choosen_city){
    console.log(chalk.red('give the city name, please'))
    exit()
}

const APIWeatherKey = process.env.APIWeatherKey;
const url = `http://api.weatherstack.com/current?access_key=${APIWeatherKey}&query=${encodeURI(choosen_city)}`;

const fn = {
    parse_and_show:(parseData)=>{
        let p = parseData;
        console.log(chalk.blue(`${p.location.name}, ${p.location.region}`))
        console.log(chalk.green(`${p.location.localtime.split(' ')[1]}`))
        console.log(`temperature: ${chalk.yellow(p.current.temperature)}, feels like: ${chalk.yellow(p.current.feelslike)}`)
        console.log(`wind speed: ${chalk.yellow(p.current.wind_speed)}`)
        console.log(`today: ${chalk.inverse(p.current.weather_descriptions)}`)
    }
}

http.get(url,(res)=>{
    const {statusCode} = res;
    if (statusCode !== 200){
        console.log(`statusCode: ${statusCode}`)
        return
    }    
    res.setEncoding('utf8')
    console.log('url',url)    

    let rowData = ''
    res.on('data', (chunk) => rowData += chunk)
    
    res.on('end', () => {
        let parseData = JSON.parse(rowData)
        fn.parse_and_show(parseData)
    })


}).on('error', (err) => {
    console.error(err)
})