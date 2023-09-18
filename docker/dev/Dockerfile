FROM node:18

LABEL maintainer="vijaywargishivam@gmail.com"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5501

CMD [ "npm", "run", "dev" ]