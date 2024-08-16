FROM node:18-alpine as base

WORKDIR /app

COPY package.json ./

RUN npm install -g @nestjs/cli

RUN npm install

COPY . .

RUN npm run build

CMD npm run start:prod

EXPOSE 3000