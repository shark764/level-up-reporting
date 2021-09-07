FROM node:14.16.1-alpine3.13

COPY . /usr/src/web-reporting/
WORKDIR /usr/src/web-reporting
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

ARG PORT_ARG=4000
ENV PORT=$PORT_ARG
COPY . /usr/src/web-reporting

EXPOSE $PORT

CMD [ "npm", "start" ]