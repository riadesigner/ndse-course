# счетчик книг

- http://localhost:8080/counter/book_id (get)
- http://localhost:8080/counter/book_id/incr (post)

### запуск:

```yml title="docker-compose.yml"

version: "3.0"

services:
  storage:
    image: 'redis'
    volumes:
      - ./data:/data
  counter:
    image: riadesigner/books-counter:ver-1.0.0
    working_dir: /app
    ports:
      - 8080:3002
    environment:
      - PORT=3002
      - REDIS_URL=redis://storage
    command: npm run start
    depends_on:
      - storage

```