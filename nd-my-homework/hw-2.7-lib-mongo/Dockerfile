
FROM node:20.8-alpine

WORKDIR /app

ARG NODE_ENV=production

COPY ./app ./

RUN npm install

CMD ["npm","run", "start"]
