FROM node:lts-slim

ENV HEALTHCHECK_PATH=/health SHOW_ALL=true

EXPOSE 8080

WORKDIR /app

ADD server.js /app/server.js

CMD ["node", "server.js"]