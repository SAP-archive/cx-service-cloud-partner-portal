FROM node:10.16.0 AS builder

ARG NEXUS_NPM_READ_TOKEN
RUN mkdir -p /app

WORKDIR /app/backend-build
COPY . .

RUN npm config set @sap-fsm:registry https://nexus.ie-1.coreinfra.io/repository/npm-all/ \
  && npm config set _auth $NEXUS_NPM_READ_TOKEN \
  && npm set progress=false \
  && npm install --unsafe-perm \
  && npm run test-ci
