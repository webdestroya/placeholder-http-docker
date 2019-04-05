FROM node:lts-slim

EXPOSE 8080/tcp

# HEALTHCHECK --interval=1m --timeout=3s \
#   CMD curl --fail http://localhost:$PORT || exit 1

WORKDIR /app

ADD server.js /app/server.js

ENTRYPOINT ["node", "server.js"]

CMD ["nothing"]