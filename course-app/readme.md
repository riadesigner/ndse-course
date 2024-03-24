# Курсовой проект

Бэкенд-приложение с API для доски объявления с чатом.   
[Подробное тех.задание здесь](https://github.com/netology-code/ndse-diplom)      
[Копия тех.задания здесь](https://github.com/riadesigner/course-app/blob/main/original-task.md)   


## запуск приложения 

### dev версия
```shell
docker compose up --build
```

### предварительная сборка
```shell
docker compose -f docker-compose-build.yml up --build 
```

### product версия
```shell
docker compose -f docker-compose-prod.yml up
```


## Общая характеристика приложения

- Приложение -> порт 8000   
- Mongo-Express -> порт 8082 

1. Приложение содержит следующие **базовые** модули:

- 1.1. Пользователи.
- 1.2. Объявления.
- 1.3. Чат.

2. Приложение содержит следующие **функциональные** модули:

- 2.1. Регистрация.
- 2.2. Аутентификация.
- 2.3. Просмотр объявлений.
- 2.4. Управление объявлениями.
- 2.5. Общение.

Подробности -> в ТЗ.

API (вход/выход > json)
- http://localhost:8000/api/signup (регистрация)
```json
{
    "name":"petya",
    "email":"petya@mail.ru",
    "password":"123",
    "contactPhone":""
}
```
- http://localhost:8000/api/signin (авторизация)
```json
{
    "email":"petya@mail.ru",
    "password":"123"
}
```
- http://localhost:8000/api/advertisements (публикация, просмотр объявлений)
```json title="multipart-form-data"
{
    "shortTitle":"shortTitle 1",
    "description":"description 1",
    "images":[]
}
```

 
### Дополнительно

Для тестирования через браузер есть несколько страниц:
- http://localhost:8000 (ссылки на главной)
- http://localhost:8000/api/login (Авторизация, регистрация)

Просмотр конкретного объявления и сообщение автору:
- http://localhost:8000/ads/655300869163c742621042b0,   
 здесь 655300869163c742621042b0 = id_advertisement 

Скрин [страницы объявления](https://github.com/riadesigner/course-app/blob/main/screen-01.png)







