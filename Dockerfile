FROM node

WORKDIR /rest-api

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]