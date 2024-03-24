
# Приложение Библиотека

- хранит данные об авторах в Mongo
- хранит данные о просмотрах в Redis через сервис Counter

### Реализовано с помощью 

- mongodb
- mongoos
- redis
- node

### Библиотека 

- http://localhost:8080
- http://localhost:8080/api/books

### Mongo Express 

- http://localhost:8081

### Счетчик 

- http://localhost:8082/counter/id_book


### запуск с помощью yml

docker compose -f docker-compose.prod.yml up

```yml title="docker-compose.prod.yml"

version: "3.0"

services:
  
  mongo:
    image: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example

  mongo-express:
    image: mongo-express
    restart: always
    ports:
      - 8081:8081
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: root
      ME_CONFIG_MONGODB_ADMINPASSWORD: example
      ME_CONFIG_MONGODB_URL: mongodb://root:example@mongo:27017/
  
  storage:
    image: 'redis'
    volumes:
      - ./data:/data
  
  counter:
    image: riadesigner/books-counter:ver-2.0.0
    working_dir: /app
    ports:
      - 8082:3000
    environment:
      - PORT=3000
      - REDIS_URL=redis://storage
    command: npm run start
    depends_on:
      - storage

  library:
    image: riadesigner/lib-mongo:v-2.0.0
    restart: always
    working_dir: /app
    ports:
      - 8080:8080
    environment:
      - PORT=8080
      - MONGO_URL=mongodb://root:example@mongo:27017/
      - COUNTER_URL=http://counter:3000
    command: npm run start
    depends_on:
      - mongo


```



