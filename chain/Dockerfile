FROM docker.io/library/node:18.14

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN cd /app \
    && npm install \
    && npx hardhat compile

ENTRYPOINT [ "npx", "hardhat", "node", "--hostname", "0.0.0.0" ]

