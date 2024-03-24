
FROM node:20.8-alpine

WORKDIR /app

# ARG NODE_ENV=production
# COPY ./app ./

COPY ./app/package.json ./
COPY ./app/package-lock.json ./

RUN npm install

CMD ["npm","run", "dev"]
