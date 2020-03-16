######### BUILD BACKEND #########
FROM node:10.16.0 AS node8Builder

RUN mkdir -p /app
ARG NEXUS_NPM_READ_TOKEN
ARG GIT_REVISION
ENV GIT_LAST_COMMIT=$GIT_REVISION
WORKDIR /
COPY resources/ resources/
COPY cs-automator/ cs-automator/
COPY ./appconfig.json ./app

WORKDIR /app/backend-build
COPY ./backend .
RUN npm config set @sap-fsm:registry https://nexus.ie-1.coreinfra.io/repository/npm-all/ \
  && npm config set always-auth true \
  && npm config set _auth $NEXUS_NPM_READ_TOKEN \
  && npm set progress=false \
  && npm install --unsafe-perm \
  && npm run build

######### BUILD FRONTEND #########

FROM node:10.16.0-alpine AS node10Builder

RUN mkdir -p /app
ARG GIT_REVISION

WORKDIR /app/frontend-build
COPY ./appconfig.json ../
COPY ./frontend .
RUN npm set progress=false \
        && npm install --unsafe-perm
RUN npm run build

# Update appconfig
WORKDIR /app
COPY ./appconfig.json .
COPY ./update-app-config.js .
RUN node ./update-app-config.js $GIT_REVISION \
        && mv ./appconfig.json ./frontend-build/dist/partner-portal/appconfig.json

######### PREPARE RELEASE #########
FROM registry.dev.coresuite.com/docker-base-webapp-nodejs-nginx:2.0.2 AS release
COPY --from=node8Builder /app/backend-build/release backend
COPY ./backend/package.json backend
COPY --from=node10Builder /app/frontend-build/dist/partner-portal frontend
