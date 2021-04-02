FROM node:15.11.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY public/* /app/public/
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY tailwind.config.js /app/tailwind.config.js
COPY craco.config.js /app/craco.config.js
RUN yarn install
