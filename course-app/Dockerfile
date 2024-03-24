FROM node:20.8-alpine 

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

CMD ["npm","run","dev"]
