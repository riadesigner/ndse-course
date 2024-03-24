# THE LIBRARY

the homework project – _trying restful api_

## API'S

- app.use('/api',api_books) // BOOKS API
- app.use('/api',api_user) // USER API

## BOOKS API ROUTES

/api/books (get all book), GET  
/api/books/:id (add new book), POST / GET (UI)  
/api/books/:id (get book by id), GET  
/api/books/:id (delete book by id), DELETE  
/api/books/:id (update book by id), POST / GET (UI)  
/api/books/:id/upload-cover (update book-cover by id), POST  
/api/books/:id/upload (update book-file by id), POST  
/api/books/:id/download (download book-file by id), GET  

## BOOK VIEWS

added views + ejs

- book/create
- book/update
- book/view
- book/show-all
- book/form

## BOOK FIELDS

{
  id: "string",
  title: "string",
  description: "string",
  authors: "string",
  favorite: bool,
  fileCover: "string",
  fileName: "string",
  fileBook: "string"
}

