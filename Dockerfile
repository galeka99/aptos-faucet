FROM node:lts-alpine

WORKDIR /app
COPY package.json /app
RUN npm install
COPY app.js /app
CMD ["node", "app.js"]