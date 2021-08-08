FROM node:16-alpine

EXPOSE 8080
WORKDIR /mems

COPY package.json /mems
RUN npm install
COPY . /mems

CMD ["npm", "start"]
