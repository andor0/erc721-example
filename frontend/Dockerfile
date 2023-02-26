FROM docker.io/library/node:16.9

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN cd /app \
    && yarn

ENTRYPOINT [ "yarn", "dev" ]

