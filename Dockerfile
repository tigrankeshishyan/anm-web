FROM node:12.16.2-alpine3.11 AS client

WORKDIR /usr/src

COPY ./packages/client/package.json .
COPY ./yarn.lock ./yarn.lock
COPY ./.yarn ./.yarn
COPY ./.yarnrc.yml ./.yarnrc.yml

RUN yarn

COPY ./packages/client .

RUN yarn build

FROM node:12.16.2-alpine3.11 AS server

WORKDIR /usr/src

COPY ./packages/server/package.json ./packages/server/package.json
COPY ./packages/db/package.json ./packages/db/package.json
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./.yarn ./.yarn
COPY ./.yarnrc.yml ./.yarnrc.yml

# bcrypt need this
RUN apk add --no-cache make gcc g++ python

RUN yarn

COPY ./packages/db ./packages/db
COPY ./packages/server ./packages/server
COPY --from=client /usr/src/build ./packages/server/public

ENV BUILD_DIR=/usr/src/packages/server/public

# for health check install curl
RUN apk add --no-cache curl

COPY ./.scripts/start ./start

CMD ["./start"]