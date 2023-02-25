# erc721-example

## Contract

### Install dependencies

```bash
cd chain
npm install
```

### Compilation

```bash
cd chain
npx hardhat compile
```

### Tests

```bash
cd chain
npx hardhat test
```

### Deploy

```bash
cd chain
npx hardhat run ./scripts/deploy.js --network localhost
```

## Backend

### Compile and Run

```bash
cd backend
cargo run
```

### Get all events

```bash
$ curl localhost:4000/events 2>/dev/null | jq
[
  {
    "CollectionCreated": {
      "collection": "70997970c51812dc3a010c7d01b50e0d17dc79c8",
      "name": "Test NFT",
      "symbol": "TNFT"
    }
  },
  {
    "TokenMinted": {
      "collection": "70997970c51812dc3a010c7d01b50e0d17dc79c8",
      "recipient": "3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
      "token_id": "0",
      "token_uri": "uri"
    }
  }
]
```

## Development

### Formatting

```bash
make fmt
```

### Run tests

```bash
make run-tests
```
