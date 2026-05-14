FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 3000