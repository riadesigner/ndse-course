
# mongodb crud

## some commands for library

- запрос(ы) для вставки данных минимум о двух книгах в коллекцию books,
- запрос для поиска полей документов коллекции books по полю title,
- запрос для редактирования полей: description и authors коллекции books по _id записи.

```js
db.createCollection("mybooks");

db.mybooks.insertMany([
    {
        id:1, 
        title: "bookname 1",
        description: "some description 1",
        authors: "author 1"
    },
    {
        id:2,
        title: "bookname 2",
        description: "some description 2",
        authors: "author 2"
    }    
]);

db.mybooks.find({title:'bookname 1'})
    
db.mybooks.updateOne(
        { _id: "_id" },
        { $set : { description:'new description', authors:'some new author'} }
    );

```

