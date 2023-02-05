# 

## Install dependencies

```bash
npm install truffle
```

## Run Ganache

```bash
docker run --rm -ti -p8545:8545 trufflesuite/ganache-cli:latest
```

## Run backend server

```
cd backend
cargo run
```

## Deploy smart-contract

```bash
npx truffle migrate
```

## Formatting

```bash
make fmt
```
