FROM node:lts-slim

ENV PORT=8080 HEALTHCHECK_PATH=/health SHOW_ALL=true

WORKDIR /app

ADD server.js /app/server.js

CMD ["node", "server.js"]