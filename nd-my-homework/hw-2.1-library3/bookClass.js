const {v4:uuid} = require('uuid')

class Book{
    constructor(opt){
        this.id = uuid(); // string                
        this.update(opt)
        return this;
    } 
    update(opt){
        this.title = opt.title || ""; // string
        this.description = opt.description || ""; // string
        this.authors = opt.authors || ""; // string
        this.favorite = opt.favorite; // bool
        this.fileCover = opt.fileCover || ""; // string
        this.fileName = opt.fileName || ""; // string        
        this.fileBook = opt.fileBook || ""; // string        
        return this;
    }
}

module.exports = Book;