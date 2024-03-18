
FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm rebuild bycrypt --build-from-source
COPY . .
RUN npm install -g nodemon
EXPOSE 4000
CMD ["node", "app.js"]
