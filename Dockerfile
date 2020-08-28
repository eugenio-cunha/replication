FROM node:12.18.2-alpine3.9

ENV HOME=/usr/src/app \
  TZ=America/Sao_Paulo \
  NODE_ENV=production

WORKDIR $HOME

COPY . $HOME

RUN apk update && apk upgrade \
  && apk add --no-cache tzdata \
  && npm install --production

EXPOSE 80

CMD [ "npm", "start" ]