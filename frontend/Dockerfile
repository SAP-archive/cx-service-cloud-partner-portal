FROM node:10.16.0-alpine AS builder

RUN apk --no-cache upgrade \
      && apk add --no-cache \
        chromium

RUN mkdir -p /app

WORKDIR /app/frontend-build
COPY ./appconfig.json ../
COPY ./frontend .
RUN npm set progress=false \
        && npm install --unsafe-perm \
        && node ./node_modules/.bin/ng test --code-coverage --karma-config=karma.conf.js
