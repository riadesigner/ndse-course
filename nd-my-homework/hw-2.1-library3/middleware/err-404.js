
module.exports = (req,res)=>{
    res.status(404)
    const title = "Оо!";
    const err_message = "Страница не найдена";
    const goto = 'localhost:3000/api/books';
    const invite_message = `перейдите на страницу: <a href="http://${goto}">${goto}</a>`;            
    res.render('err-404',{title,err_message,invite_message})
}