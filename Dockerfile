FROM node:14.16.1-alpine3.13

COPY . /usr/src/web-reporting/
WORKDIR /usr/src/web-reporting
RUN ["npm", "install"]


ARG PORT_ARG=4000
ENV PORT=$PORT_ARG
COPY . /usr/src/web-reporting


WORKDIR /usr/src/web-reporting/dist

EXPOSE $PORT

CMD [ "node", "index.js" ]