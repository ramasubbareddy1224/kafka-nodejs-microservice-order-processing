FROM node:alpine as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
FROM development as builder
ENV NODE_ENV production
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
