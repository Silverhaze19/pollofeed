FROM node:carbon
MAINTAINER joe chimienti <jchimien@gmail.com>
RUN mkdir /pollofeed
RUN chown -R node:node /pollofeed
WORKDIR /pollofeed
#ARG NODE_ENV=production
#ENV NODE_ENV $NODE_ENV
USER node
COPY --chown=node:node package.json package-lock.json  ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build
EXPOSE ${APP_PORT}
CMD node ./bin/www.js
